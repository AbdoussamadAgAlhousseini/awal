import { describe, it, expect } from "vitest";
import { inflect, buildParadigm, PERSONS, ASPECTS } from "./conjugation.mjs";

const person = (code: string) => PERSONS.find((p) => p.code === code);

describe("moteur de conjugaison", () => {
  it("3e masc. : i- se consonantise en y- devant voyelle (régression)", () => {
    // Sans la règle, le préfixe disparaissait et la forme = radical nu.
    const form = inflect("əgməy", person("3sm"));
    expect(form).toBe("yəgməy");
    expect(form).not.toBe("əgməy");
  });

  it("3e masc. : i- conservé devant consonne", () => {
    expect(inflect("gămmăy", person("3sm"))).toBe("igămmăy");
  });

  it("la marque de 3e masc. n'est jamais entièrement effacée", () => {
    // Sur une initiale vocalique, la forme fléchie doit différer du radical nu.
    for (const stem of ["əgməy", "əsu", "aləm"]) {
      expect(inflect(stem, person("3sm"))).not.toBe(stem);
    }
  });

  it("2e sing. : voyelle d'appui de tə- élidée devant voyelle", () => {
    expect(inflect("əgməy", person("2s"))).toBe("təgməyăd");
  });

  it("buildParadigm génère les aspects documentés", () => {
    const p = buildParadigm([
      { aspect: "aoriste", stem: "əgməy", attested: false },
      { aspect: "accompli", stem: "əgmăy", attested: true },
    ]) as Array<Record<string, unknown> & { forms: unknown[] }>;
    const aoriste = p.find((a) => a.aspect === "aoriste")!;
    expect(aoriste.documented).toBe(true);
    expect(aoriste.forms).toHaveLength(PERSONS.length);
    const accompli = p.find((a) => a.aspect === "accompli")!;
    expect(accompli.attested).toBe(true);
  });

  it("n'invente RIEN pour un aspect non documenté", () => {
    const p = buildParadigm([{ aspect: "aoriste", stem: "əgməy", attested: false }]) as Array<
      Record<string, unknown> & { forms: unknown[] }
    >;
    const missing = p.filter((a) => !a.documented);
    expect(missing.length).toBe(ASPECTS.length - 1);
    for (const a of missing) {
      expect(a.forms).toHaveLength(0);
      expect(a.stem).toBeNull();
    }
  });
});
