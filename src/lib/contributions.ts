import { db } from "@/lib/db";
import { phoneticKey } from "@/lib/phonetics.mjs";

export type Payload = Record<string, string>;

export function parsePayload(json: string): Payload {
  try {
    return JSON.parse(json) as Payload;
  } catch {
    return {};
  }
}

/** Points de réputation accordés lorsqu'une proposition est acceptée. */
const POINTS: Record<string, number> = { new_lexeme: 5, example: 2, variant: 2 };

async function journal(entity: string, entityId: string, action: string, payload: unknown, userId?: string) {
  await db.revision.create({
    data: { entity, entityId, action, payload: JSON.stringify(payload ?? {}), userId: userId ?? null },
  });
}

/**
 * Applique une contribution approuvée au lexique, puis journalise (§18, §21).
 * Retourne l'identifiant de l'entrée touchée, ou null si rien n'a pu être appliqué.
 */
export async function applyContribution(contributionId: string, reviewerId: string): Promise<string | null> {
  const c = await db.contribution.findUnique({ where: { id: contributionId } });
  if (!c || c.status !== "pending") return null;

  // Intégrité scientifique : personne ne valide sa propre proposition (§18, §28).
  if (c.authorId === reviewerId) return null;

  const p = parsePayload(c.payload);
  let touched: string | null = null;

  if (c.kind === "new_lexeme") {
    const headword = (p.headword || "").trim();
    if (!headword) return null;

    const lexeme = await db.lexeme.create({
      data: {
        headword,
        tifinagh: (p.tifinagh || "").trim(),
        ipa: p.ipa?.trim() || null,
        pos: p.pos?.trim() || "nom",
        phonetic: phoneticKey(headword),
        status: "published",
        senses: {
          create: [
            {
              order: 1,
              defShort: (p.defShort || "").trim() || headword,
              translations: JSON.stringify({
                ...(p.trFr ? { fr: p.trFr.trim() } : {}),
                ...(p.trEn ? { en: p.trEn.trim() } : {}),
                ...(p.trAr ? { ar: p.trAr.trim() } : {}),
              }),
            },
          ],
        },
        ...(p.areaId
          ? { variants: { create: [{ areaId: p.areaId, form: p.variantForm?.trim() || headword }] } }
          : {}),
      },
    });
    touched = lexeme.id;
    await journal("lexeme", lexeme.id, "create", p, reviewerId);
  }

  if (c.kind === "example") {
    const senseId = p.senseId;
    const text = (p.text || "").trim();
    if (!senseId || !text) return null;
    const sense = await db.sense.findUnique({ where: { id: senseId }, select: { id: true, lexemeId: true } });
    if (!sense) return null;

    const ex = await db.example.create({
      data: { senseId, text, translation: p.translation?.trim() || null },
    });
    touched = sense.lexemeId;
    await journal("example", ex.id, "create", p, reviewerId);
  }

  if (c.kind === "variant") {
    const lexemeId = c.lexemeId;
    const areaId = p.areaId;
    const form = (p.form || "").trim();
    if (!lexemeId || !areaId || !form) return null;

    // Contrainte d'unicité (lexemeId, areaId) : on met à jour si la variante existe déjà.
    const variant = await db.variant.upsert({
      where: { lexemeId_areaId: { lexemeId, areaId } },
      update: { form, ipa: p.ipa?.trim() || null },
      create: { lexemeId, areaId, form, ipa: p.ipa?.trim() || null },
    });
    touched = lexemeId;
    await journal("variant", variant.id, "create", p, reviewerId);
  }

  if (touched === null) return null;

  await db.contribution.update({
    where: { id: c.id },
    data: { status: "approved", reviewerId, reviewedAt: new Date(), lexemeId: c.lexemeId ?? touched },
  });

  await db.user.update({
    where: { id: c.authorId },
    data: { reputation: { increment: POINTS[c.kind] ?? 1 } },
  });

  return touched;
}
