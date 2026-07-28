import { db } from "@/lib/db";

/**
 * Statistiques « santé de la langue » (§20).
 *
 * PRINCIPE D'HONNÊTETÉ : on ne calcule que ce que la base contient réellement.
 *  - Couverture, complétude, communauté : données réelles.
 *  - « Indice de couverture documentaire » par aire : dérivé des variantes et de
 *    l'audio disponibles. Il mesure à quel point une aire est DOCUMENTÉE ici, pas
 *    la vitalité réelle du parler (qui dépend des locuteurs, non d'un dictionnaire).
 *  - Usage (recherches, vues) : NON instrumenté → non affiché comme une valeur.
 */

function pct(n: number, total: number): number {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

export type Stats = Awaited<ReturnType<typeof computeStats>>;

export async function computeStats() {
  const total = await db.lexeme.count();

  // ── Couverture ────────────────────────────────────────────────────────────
  const posRows = await db.lexeme.groupBy({ by: ["pos"], _count: { _all: true } });
  const byPos = posRows
    .map((r) => ({ pos: r.pos, count: r._count._all }))
    .sort((a, b) => b.count - a.count);

  const senseCount = await db.sense.count();
  const avgSenses = total === 0 ? 0 : Math.round((senseCount / total) * 10) / 10;

  // ── Complétude (part des entrées possédant chaque élément) ─────────────────
  const [withTifinagh, withIpa, withTranslation, withExample, withAudio] = await Promise.all([
    db.lexeme.count({ where: { tifinagh: { not: "" } } }),
    db.lexeme.count({ where: { AND: [{ ipa: { not: null } }, { ipa: { not: "" } }] } }),
    db.lexeme.count({ where: { senses: { some: { AND: [{ translations: { not: null } }, { translations: { not: "{}" } }] } } } }),
    db.lexeme.count({ where: { senses: { some: { examples: { some: {} } } } } }),
    db.lexeme.count({ where: { media: { some: { kind: "audio" } } } }),
  ]);

  const completeness = [
    { key: "tifinagh", count: withTifinagh, pct: pct(withTifinagh, total) },
    { key: "ipa", count: withIpa, pct: pct(withIpa, total) },
    { key: "translation", count: withTranslation, pct: pct(withTranslation, total) },
    { key: "example", count: withExample, pct: pct(withExample, total) },
    { key: "audio", count: withAudio, pct: pct(withAudio, total) },
  ];

  // ── Communauté ────────────────────────────────────────────────────────────
  const contributors = await db.user.count();
  const activeContributors = (await db.contribution.findMany({ distinct: ["authorId"], select: { authorId: true } })).length;
  const contribRows = await db.contribution.groupBy({ by: ["status"], _count: { _all: true } });
  const contributions = {
    total: contribRows.reduce((s, r) => s + r._count._all, 0),
    pending: contribRows.find((r) => r.status === "pending")?._count._all ?? 0,
    approved: contribRows.find((r) => r.status === "approved")?._count._all ?? 0,
    rejected: contribRows.find((r) => r.status === "rejected")?._count._all ?? 0,
  };

  const reviewed = await db.contribution.findMany({
    where: { reviewedAt: { not: null } },
    select: { createdAt: true, reviewedAt: true },
  });
  const delaysH = reviewed.map((c) => (c.reviewedAt!.getTime() - c.createdAt.getTime()) / 3_600_000);
  const medianReviewH = median(delaysH);

  // ── Indice de couverture documentaire par aire ────────────────────────────
  const areas = await db.area.findMany({ orderBy: { country: "asc" } });
  const variantCounts = await db.variant.groupBy({ by: ["areaId"], _count: { _all: true } });
  const varBy = new Map(variantCounts.map((v) => [v.areaId, v._count._all]));
  const audioCounts = await db.media.groupBy({
    by: ["speakerId"],
    where: { kind: "audio" },
    _count: { _all: true },
  });
  // Rattacher les audios à leur aire via le locuteur.
  const speakerAreas = await db.speaker.findMany({ select: { id: true, areaId: true } });
  const speakerAreaBy = new Map(speakerAreas.map((s) => [s.id, s.areaId]));
  const audioByArea = new Map<string, number>();
  for (const a of audioCounts) {
    const areaId = a.speakerId ? speakerAreaBy.get(a.speakerId) : null;
    if (areaId) audioByArea.set(areaId, (audioByArea.get(areaId) ?? 0) + a._count._all);
  }

  const vitality = areas.map((a) => {
    const documented = varBy.get(a.id) ?? 0;
    const coverage = pct(documented, total);
    const audio = pct(audioByArea.get(a.id) ?? 0, total);
    // Indice : couverture pondérée (0,8) + présence audio (0,2).
    const index = Math.round(coverage * 0.8 + audio * 0.2);
    return { code: a.code, country: a.country, documented, coverage, audio, index };
  });

  return {
    total,
    byPos,
    avgSenses,
    completeness,
    community: { contributors, activeContributors, contributions, medianReviewH },
    vitality,
  };
}
