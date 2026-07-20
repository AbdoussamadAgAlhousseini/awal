import { db } from "@/lib/db";
import { phoneticKey, looseNormalize, levenshtein, hasTifinagh } from "@/lib/phonetics.mjs";

export type Hit = {
  id: string;
  slug: string;
  headword: string;
  tifinagh: string;
  ipa: string | null;
  pos: string;
  defShort: string | null;
  translations: string | null;
  score: number;
};

const SELECT = {
  id: true,
  slug: true,
  headword: true,
  tifinagh: true,
  ipa: true,
  pos: true,
  phonetic: true,
  senses: { orderBy: { order: "asc" as const }, take: 1, select: { defShort: true, translations: true } },
  variants: { select: { form: true } },
};

type Row = {
  id: string; slug: string; headword: string; tifinagh: string; ipa: string | null; pos: string; phonetic: string;
  senses: { defShort: string; translations: string | null }[];
  variants: { form: string }[];
};

function toHit(r: Row, score: number): Hit {
  return {
    id: r.id, slug: r.slug, headword: r.headword, tifinagh: r.tifinagh, ipa: r.ipa, pos: r.pos,
    defShort: r.senses[0]?.defShort ?? null,
    translations: r.senses[0]?.translations ?? null,
    score,
  };
}

/**
 * Recherche à trois niveaux (§13) :
 *   1. lexical  — forme exacte, préfixe, sous-chaîne, variante, traduction
 *   2. phonétique — même squelette consonantique (tolère gh/g, k/q, diacritiques, tifinagh)
 *   3. floue    — distance d'édition ≤ 2 sur la forme normalisée
 *
 * Le niveau 1 est filtré en base (indexé). Les niveaux 2-3 ne se déclenchent que si
 * le niveau 1 est pauvre, et chargent alors le lexique en mémoire pour le scoring.
 * À l'échelle, ce calcul doit migrer vers OpenSearch + pg_trgm (§13, §26).
 */
export async function searchLexemes(rawQuery: string, limit = 40): Promise<{ hits: Hit[]; approximate: boolean }> {
  const term = rawQuery.trim();
  if (!term) return { hits: [], approximate: false };

  const scored = new Map<string, number>();
  const rows = new Map<string, Row>();

  const remember = (r: Row, score: number) => {
    rows.set(r.id, r);
    const prev = scored.get(r.id) ?? 0;
    if (score > prev) scored.set(r.id, score);
  };

  // --- Niveau 1 : lexical (en base) ---
  const lexical = (await db.lexeme.findMany({
    where: {
      OR: [
        { headword: { contains: term } },
        { tifinagh: { contains: term } },
        { variants: { some: { form: { contains: term } } } },
        { senses: { some: { OR: [{ defShort: { contains: term } }, { translations: { contains: term } }] } } },
      ],
    },
    select: SELECT,
    take: limit,
  })) as Row[];

  const qLoose = looseNormalize(term);
  for (const r of lexical) {
    const hLoose = looseNormalize(r.headword);
    let s = 70; // trouvé via définition/traduction
    if (hLoose === qLoose) s = 100;
    else if (hLoose.startsWith(qLoose)) s = 92;
    else if (r.headword.toLowerCase().includes(term.toLowerCase())) s = 84;
    else if (hasTifinagh(term) && r.tifinagh.includes(term)) s = 92;
    else if (r.variants.some((v) => looseNormalize(v.form) === qLoose)) s = 80;
    remember(r, s);
  }

  // --- Niveaux 2 & 3 : phonétique + flou ---
  // Ce sont des REPLIS (« vouliez-vous dire… »), pas des compléments : on ne les
  // déclenche que si le niveau lexical n'a rien trouvé, sinon ils polluent des
  // résultats déjà pertinents (« aman » ramènerait « akal », « eau » ramènerait « aḍu »).
  if (lexical.length === 0 && qLoose.length >= 2) {
    const all = (await db.lexeme.findMany({ select: SELECT })) as Row[];
    const qKey = phoneticKey(term);

    for (const r of all) {
      const hLoose = looseNormalize(r.headword);

      if (qKey && r.phonetic === qKey) remember(r, 66);

      const forms = [hLoose, ...r.variants.map((v) => looseNormalize(v.form))];
      const best = Math.min(...forms.map((f) => levenshtein(qLoose, f)));
      if (qLoose.length >= 3) {
        if (best === 1) remember(r, 60);
        else if (best === 2) remember(r, 48);
      } else if (best === 1) {
        remember(r, 52);
      }
    }
  }

  const hits = [...scored.entries()]
    .map(([id, score]) => toHit(rows.get(id)!, score))
    .sort((a, b) => b.score - a.score || a.headword.localeCompare(b.headword))
    .slice(0, limit);

  // « Approché » si aucun résultat n'est un vrai match lexical.
  const approximate = hits.length > 0 && hits.every((h) => h.score < 70);
  return { hits, approximate };
}
