"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { phoneticKey } from "@/lib/phonetics.mjs";

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
