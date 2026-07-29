// Awal — génération de quiz (§17).
//
// Fonction PURE : elle prend des entrées déjà localisées (glose dans la langue de
// l'apprenant) et produit des questions à choix multiples. Aucune dépendance à la
// base ici, ce qui la rend testable et déterministe (rng injectable).

export type QuizKind = "meaning" | "word" | "script";

export type QuizOption = {
  id: string;
  label: string;
  tif?: string; // tifinagh affiché à côté du libellé (questions « mot »)
};

export type Question = {
  id: string;
  kind: QuizKind;
  promptTif?: string;
  promptLat?: string;
  promptGloss?: string;
  options: QuizOption[];
  correctId: string;
};

export type QuizEntry = {
  id: string;
  headword: string;
  tifinagh: string;
  gloss: string; // sens dans la langue cible
};

/** Mélange Fisher–Yates avec générateur injectable (déterminisme des tests). */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const KINDS: QuizKind[] = ["meaning", "word", "script"];

/**
 * Construit un quiz de `count` questions à partir des entrées fournies.
 * Chaque question a 4 options dont une seule correcte ; les distracteurs sont
 * d'autres entrées, choisis pour ne pas dupliquer le libellé de la bonne réponse.
 */
export function buildQuiz(entries: QuizEntry[], count = 10, rng: () => number = Math.random): Question[] {
  const usable = entries.filter((e) => e.gloss && e.headword && e.tifinagh);
  if (usable.length < 4) return [];

  const chosen = shuffle(usable, rng).slice(0, count);

  return chosen.map((e, i) => {
    const kind = KINDS[Math.floor(rng() * KINDS.length)];
    const distractors = shuffle(usable.filter((x) => x.id !== e.id), rng).slice(0, 3);
    const pool = shuffle([e, ...distractors], rng);

    const options: QuizOption[] = pool.map((o) => {
      if (kind === "meaning") return { id: o.id, label: o.gloss };
      // « word » et « script » : la réponse est un mot tamasheq.
      return { id: o.id, label: o.headword, tif: o.tifinagh };
    });

    const base = { id: `${e.id}-${i}`, options, correctId: e.id };
    if (kind === "meaning") return { ...base, kind, promptTif: e.tifinagh, promptLat: e.headword };
    if (kind === "word") return { ...base, kind, promptGloss: e.gloss };
    return { ...base, kind, promptTif: e.tifinagh }; // script : tifinagh seul
  });
}
