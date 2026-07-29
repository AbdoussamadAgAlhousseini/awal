import { describe, it, expect } from "vitest";
import { buildQuiz, shuffle, type QuizEntry } from "./quiz";

const entries: QuizEntry[] = Array.from({ length: 12 }, (_, i) => ({
  id: `w${i}`,
  headword: `mot${i}`,
  tifinagh: `ⵎ${i}`,
  gloss: `sens ${i}`,
}));

// Générateur pseudo-aléatoire déterministe (LCG) pour des tests reproductibles.
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

describe("génération de quiz", () => {
  it("produit le nombre de questions demandé", () => {
    expect(buildQuiz(entries, 8, seeded(1))).toHaveLength(8);
    expect(buildQuiz(entries, 100, seeded(1))).toHaveLength(entries.length);
  });

  it("chaque question a 4 options distinctes dont la bonne réponse", () => {
    for (const q of buildQuiz(entries, 12, seeded(42))) {
      expect(q.options).toHaveLength(4);
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size).toBe(4); // pas de doublon
      expect(ids).toContain(q.correctId); // la bonne réponse est présente
    }
  });

  it("varie les types de questions", () => {
    const kinds = new Set(buildQuiz(entries, 12, seeded(7)).map((q) => q.kind));
    expect(kinds.size).toBeGreaterThan(1);
  });

  it("renvoie un quiz vide si trop peu d'entrées (moins de 4)", () => {
    expect(buildQuiz(entries.slice(0, 3), 10, seeded(1))).toHaveLength(0);
  });

  it("ignore les entrées sans glose", () => {
    const partial = [...entries.slice(0, 4), { id: "x", headword: "x", tifinagh: "ⵅ", gloss: "" }];
    for (const q of buildQuiz(partial, 5, seeded(3))) {
      expect(q.options.every((o) => o.label !== "")).toBe(true);
    }
  });

  it("shuffle conserve les mêmes éléments", () => {
    const src = [1, 2, 3, 4, 5];
    expect(shuffle(src, seeded(9)).sort()).toEqual(src);
  });
});
