"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLocale } from "@/lib/i18n";
import { LOCALE_COOKIE } from "@/lib/locale";
import { USER_COOKIE, getCurrentUser, isModerator } from "@/lib/session";
import { applyContribution } from "@/lib/contributions";
import { schedule, RATINGS } from "@/lib/srs.mjs";
import { db } from "@/lib/db";
import { signIn as authSignIn, signOut as authSignOut, authConfigured } from "@/auth";

/** Enregistre la langue choisie (cookie 1 an) puis revient à la page voulue. */
export async function setLocale(formData: FormData) {
  const locale = formData.get("locale");
  const next = String(formData.get("next") || "/");

  if (isLocale(locale)) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  redirect(next.startsWith("/") ? next : "/");
}

/** Connexion via un fournisseur d'identité (§25). */
export async function oauthSignIn(providerId: string) {
  if (!authConfigured || !authSignIn) redirect("/compte");
  await authSignIn(providerId, { redirectTo: "/compte" });
}

/** Déconnexion d'une session Auth.js. */
export async function oauthSignOut() {
  if (!authConfigured || !authSignOut) redirect("/compte");
  await authSignOut({ redirectTo: "/compte" });
}

/**
 * Identité pseudonyme — MODE PROTOTYPE UNIQUEMENT.
 *
 * Le code de modération est un garde simple lu dans l'environnement : il ne prouve
 * rien sur l'identité de qui l'emploie. Cette voie se ferme d'elle-même dès qu'un
 * fournisseur OAuth est configuré (§25).
 */
export async function signIn(formData: FormData) {
  // Porte dérobée fermée dès que l'authentification réelle est en place.
  if (authConfigured) redirect("/compte");

  const pseudonym = String(formData.get("pseudonym") || "").trim().slice(0, 40);
  const code = String(formData.get("moderatorCode") || "").trim();
  if (!pseudonym) redirect("/compte?e=1");

  const expected = process.env.AWAL_MODERATOR_CODE || "";
  const wantsModerator = expected.length > 0 && code === expected;

  const existing = await db.user.findUnique({ where: { pseudonym } });
  const user = existing
    ? await db.user.update({
        where: { id: existing.id },
        data: wantsModerator ? { role: "moderator" } : {},
      })
    : await db.user.create({
        data: { pseudonym, role: wantsModerator ? "moderator" : "contributor" },
      });

  const store = await cookies();
  store.set(USER_COOKIE, user.id, { path: "/", maxAge: 60 * 60 * 24 * 90, sameSite: "lax", httpOnly: true });
  redirect("/compte");
}

export async function signOut() {
  const store = await cookies();
  store.delete(USER_COOKIE);
  redirect("/compte");
}

/** Ajoute une entrée au paquet de révision, dans les deux sens d'étude (§17). */
export async function addToDeck(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/compte");

  const lexemeId = String(formData.get("lexemeId") || "");
  if (!lexemeId) redirect("/apprendre");

  for (const direction of ["t2l", "l2t"]) {
    await db.card.upsert({
      where: { userId_lexemeId_direction: { userId: user.id, lexemeId, direction } },
      update: {},
      create: { userId: user.id, lexemeId, direction },
    });
  }

  revalidatePath("/apprendre");
  redirect("/apprendre");
}

/** Enregistre une révision et replanifie la carte selon SM-2 (§17). */
export async function reviewCard(rating: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/compte");

  const cardId = String(formData.get("cardId") || "");
  if (!cardId || !RATINGS.includes(rating)) redirect("/apprendre");

  const card = await db.card.findUnique({ where: { id: cardId } });
  if (!card || card.userId !== user.id) redirect("/apprendre");

  const next = schedule(
    { interval: card.interval, ease: card.ease, reps: card.reps, lapses: card.lapses },
    rating as "again" | "hard" | "good" | "easy",
  );

  await db.card.update({
    where: { id: card.id },
    data: {
      interval: next.interval,
      ease: next.ease,
      reps: next.reps,
      lapses: next.lapses,
      due: next.due,
      lastReviewed: new Date(),
    },
  });

  revalidatePath("/apprendre");
  redirect("/apprendre");
}

/** Retire une entrée du paquet. */
export async function removeFromDeck(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/compte");
  const lexemeId = String(formData.get("lexemeId") || "");
  if (lexemeId) await db.card.deleteMany({ where: { userId: user.id, lexemeId } });
  revalidatePath("/apprendre");
  redirect("/apprendre");
}

/** Dépose une proposition dans la file de modération (§18). */
export async function submitContribution(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/compte");

  const kind = String(formData.get("kind") || "");
  const lexemeId = String(formData.get("lexemeId") || "") || null;
  const note = String(formData.get("note") || "").trim() || null;

  const field = (n: string) => String(formData.get(n) || "").trim();
  let payload: Record<string, string> = {};

  if (kind === "new_lexeme") {
    payload = {
      headword: field("headword"), tifinagh: field("tifinagh"), ipa: field("ipa"),
      pos: field("pos"), defShort: field("defShort"),
      trFr: field("trFr"), trEn: field("trEn"), trAr: field("trAr"),
      areaId: field("areaId"), variantForm: field("variantForm"),
    };
    if (!payload.headword || !payload.defShort) redirect("/contribuer?e=1");
  } else if (kind === "example") {
    payload = { senseId: field("senseId"), text: field("text"), translation: field("translation") };
    if (!payload.senseId || !payload.text) redirect(`/contribuer?e=1&lexeme=${lexemeId ?? ""}`);
  } else if (kind === "variant") {
    payload = { areaId: field("areaId"), form: field("form"), ipa: field("ipa") };
    if (!payload.areaId || !payload.form) redirect(`/contribuer?e=1&lexeme=${lexemeId ?? ""}`);
  } else if (kind === "audio") {
    payload = {
      uri: field("uri"), speakerPseudonym: field("speakerPseudonym"),
      areaId: field("areaId"), license: field("license"),
      ipa: field("ipa"), notes: field("notes"),
      // Le consentement du locuteur est une condition de recevabilité, pas une option.
      consent: formData.get("consent") ? "yes" : "",
    };
    if (!payload.uri || !payload.speakerPseudonym || !payload.consent) {
      redirect(`/contribuer?e=1&kind=audio&lexeme=${lexemeId ?? ""}`);
    }
  } else {
    redirect("/contribuer?e=1");
  }

  await db.contribution.create({
    data: { kind, payload: JSON.stringify(payload), note, authorId: user.id, lexemeId },
  });

  redirect("/compte?sent=1");
}

/**
 * Décision d'un valideur : approuver (et appliquer) ou refuser (§18, §19).
 *
 * La décision est LIÉE à l'action (`.bind`) et non lue dans le formulaire : React
 * n'inclut pas le name/value du bouton de soumission dans le FormData d'une Server
 * Action, donc deux boutons `name="decision"` seraient indistinguables.
 */
export async function reviewContribution(decision: "approve" | "reject", formData: FormData) {
  const user = await getCurrentUser();
  if (!isModerator(user) || !user) redirect("/moderation");

  const id = String(formData.get("id") || "");
  const reviewNote = String(formData.get("reviewNote") || "").trim() || null;
  if (!id) redirect("/moderation");

  // Intégrité : on refuse l'action et on LAISSE la proposition en attente,
  // pour qu'un autre valideur puisse s'en charger (§18, §28).
  const target = await db.contribution.findUnique({ where: { id }, select: { authorId: true } });
  if (target?.authorId === user.id) redirect("/moderation?e=self");

  if (decision === "approve") {
    const touched = await applyContribution(id, user.id);
    if (touched === null) {
      // Charge utile inapplicable (entrée supprimée, champ manquant) : on refuse explicitement.
      await db.contribution.update({
        where: { id },
        data: {
          status: "rejected", reviewerId: user.id, reviewedAt: new Date(),
          reviewNote: reviewNote ?? "Proposition inapplicable en l'état.",
        },
      });
    }
  } else {
    await db.contribution.update({
      where: { id },
      data: { status: "rejected", reviewerId: user.id, reviewedAt: new Date(), reviewNote },
    });
  }

  revalidatePath("/moderation");
  redirect("/moderation");
}
