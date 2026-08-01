"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { phoneticKey } from "@/lib/phonetics.mjs";
import { slugify } from "@/lib/slug.mjs";

/** Garde commune : renvoie l'utilisateur valideur, ou redirige. */
async function requireModerator() {
  const user = await getCurrentUser();
  if (!isModerator(user) || !user) redirect("/admin");
  return user;
}

/**
 * Back-office (§19). Toutes les écritures :
 *  - sont réservées aux valideurs (garde côté serveur) ;
 *  - sont journalisées dans Revision (audit réversible, §21) ;
 *  - NE changent PAS le slug d'une entrée existante — l'identifiant public doit
 *    rester stable même si la forme vedette est corrigée (§8). Seule la clé
 *    phonétique est recalculée.
 */

async function journal(entity: string, entityId: string, action: string, payload: unknown, userId: string) {
  await db.revision.create({
    data: { entity, entityId, action, payload: JSON.stringify(payload ?? {}), userId },
  });
}

const field = (fd: FormData, n: string) => String(fd.get(n) || "").trim();

export async function updateLexeme(formData: FormData) {
  const user = await getCurrentUser();
  if (!isModerator(user) || !user) redirect("/admin");

  const id = field(formData, "id");
  if (!id) redirect("/admin/lexemes");

  const lx = await db.lexeme.findUnique({ where: { id }, include: { senses: { orderBy: { order: "asc" }, take: 1 } } });
  if (!lx) redirect("/admin/lexemes");

  const headword = field(formData, "headword") || lx.headword;

  const data = {
    headword,
    tifinagh: field(formData, "tifinagh"),
    ipa: field(formData, "ipa") || null,
    pos: field(formData, "pos") || lx.pos,
    gender: field(formData, "gender") || null,
    number: field(formData, "number") || null,
    register: field(formData, "register") || null,
    etymology: field(formData, "etymology") || null,
    // Le slug reste figé ; seule la clé phonétique suit la forme vedette.
    phonetic: phoneticKey(headword),
  };

  await db.lexeme.update({ where: { id }, data });

  // Sens principal : définition + traductions.
  const translations = JSON.stringify({
    ...(field(formData, "trFr") ? { fr: field(formData, "trFr") } : {}),
    ...(field(formData, "trEn") ? { en: field(formData, "trEn") } : {}),
    ...(field(formData, "trAr") ? { ar: field(formData, "trAr") } : {}),
  });
  const defShort = field(formData, "defShort") || lx.senses[0]?.defShort || headword;
  const defLong = field(formData, "defLong") || null;

  if (lx.senses[0]) {
    await db.sense.update({ where: { id: lx.senses[0].id }, data: { defShort, defLong, translations } });
  } else {
    await db.sense.create({ data: { lexemeId: id, order: 1, defShort, defLong, translations } });
  }

  await journal("lexeme", id, "update", { ...data, defShort, defLong, translations }, user.id);
  revalidatePath("/admin/lexemes");
  redirect(`/admin/lexemes/${lx.slug}/edit?saved=1`);
}

export async function deleteLexeme(formData: FormData) {
  const user = await getCurrentUser();
  if (!isModerator(user) || !user) redirect("/admin");

  const id = field(formData, "id");
  if (!id) redirect("/admin/lexemes");

  const lx = await db.lexeme.findUnique({ where: { id } });
  if (!lx) redirect("/admin/lexemes");

  // On journalise AVANT de supprimer, en conservant l'état pour réversibilité.
  await journal("lexeme", id, "delete", { headword: lx.headword, tifinagh: lx.tifinagh, slug: lx.slug }, user.id);
  await db.lexeme.delete({ where: { id } }); // cascade : sens, variantes, médias, cartes…

  revalidatePath("/admin/lexemes");
  redirect("/admin/lexemes?deleted=1");
}

/* ─────────────── Encyclopédie (§9) ─────────────── */

async function uniqueArticleSlug(base: string): Promise<string> {
  let slug = base || "fiche";
  for (let n = 2; await db.article.findUnique({ where: { slug } }); n++) slug = `${base}-${n}`;
  return slug;
}

export async function createArticle(formData: FormData) {
  const user = await requireModerator();
  const title = field(formData, "title");
  if (!title) redirect("/admin/articles/new?e=1");

  const article = await db.article.create({
    data: {
      slug: await uniqueArticleSlug(slugify(title)),
      title,
      summary: field(formData, "summary"),
      body: field(formData, "body"),
      category: field(formData, "category") || "histoire",
      areaId: field(formData, "areaId") || null,
      sensitivity: field(formData, "sensitivity") === "restricted" ? "restricted" : "public",
      restrictionNote: field(formData, "restrictionNote") || null,
      status: field(formData, "status") || "published",
    },
  });
  await journal("article", article.id, "create", { title, slug: article.slug }, user.id);
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.slug}/edit?saved=1`);
}

export async function updateArticle(formData: FormData) {
  const user = await requireModerator();
  const id = field(formData, "id");
  const a = await db.article.findUnique({ where: { id } });
  if (!a) redirect("/admin/articles");

  const data = {
    title: field(formData, "title") || a.title,
    summary: field(formData, "summary"),
    body: field(formData, "body"),
    category: field(formData, "category") || a.category,
    areaId: field(formData, "areaId") || null,
    // Le champ de sensibilité (CARE, §9) : marquer « restricted » masque le corps.
    sensitivity: field(formData, "sensitivity") === "restricted" ? "restricted" : "public",
    restrictionNote: field(formData, "restrictionNote") || null,
    status: field(formData, "status") || a.status,
  };
  await db.article.update({ where: { id }, data }); // slug figé (§8)
  await journal("article", id, "update", data, user.id);
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${a.slug}/edit?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  const user = await requireModerator();
  const id = field(formData, "id");
  const a = await db.article.findUnique({ where: { id } });
  if (!a) redirect("/admin/articles");
  await journal("article", id, "delete", { title: a.title, slug: a.slug }, user.id);
  await db.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  redirect("/admin/articles?deleted=1");
}

/* ─────────────── Bibliothèque (§16) ─────────────── */

export async function createDocument(formData: FormData) {
  const user = await requireModerator();
  const title = field(formData, "title");
  if (!title) redirect("/admin/documents/new?e=1");

  const doc = await db.document.create({
    data: {
      title,
      author: field(formData, "author") || null,
      year: field(formData, "year") || null,
      kind: field(formData, "kind") || "livre",
      language: field(formData, "language") || null,
      description: field(formData, "description") || null,
      rights: ["open", "restricted", "unknown"].includes(field(formData, "rights"))
        ? field(formData, "rights")
        : "unknown",
      rightsNote: field(formData, "rightsNote") || null,
      url: field(formData, "url") || null,
    },
  });
  await journal("document", doc.id, "create", { title }, user.id);
  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${doc.id}/edit?saved=1`);
}

export async function updateDocument(formData: FormData) {
  const user = await requireModerator();
  const id = field(formData, "id");
  const d = await db.document.findUnique({ where: { id } });
  if (!d) redirect("/admin/documents");

  const data = {
    title: field(formData, "title") || d.title,
    author: field(formData, "author") || null,
    year: field(formData, "year") || null,
    kind: field(formData, "kind") || d.kind,
    language: field(formData, "language") || null,
    description: field(formData, "description") || null,
    rights: ["open", "restricted", "unknown"].includes(field(formData, "rights"))
      ? field(formData, "rights")
      : d.rights,
    rightsNote: field(formData, "rightsNote") || null,
    url: field(formData, "url") || null,
  };
  await db.document.update({ where: { id }, data });
  await journal("document", id, "update", data, user.id);
  revalidatePath("/admin/documents");
  redirect(`/admin/documents/${id}/edit?saved=1`);
}

export async function deleteDocument(formData: FormData) {
  const user = await requireModerator();
  const id = field(formData, "id");
  const d = await db.document.findUnique({ where: { id } });
  if (!d) redirect("/admin/documents");
  await journal("document", id, "delete", { title: d.title }, user.id);
  await db.document.delete({ where: { id } });
  revalidatePath("/admin/documents");
  redirect("/admin/documents?deleted=1");
}
