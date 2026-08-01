import { describe, it, expect } from "vitest";
import { normalizeSearchTerm } from "./searchlog";

describe("normalisation des recherches (analytique anonyme)", () => {
  it("met en minuscules et réduit les espaces", () => {
    expect(normalizeSearchTerm("  Aman   d  iman ")).toBe("aman d iman");
    expect(normalizeSearchTerm("EAU")).toBe("eau");
  });

  it("fusionne les variantes de casse en une seule clé", () => {
    expect(normalizeSearchTerm("Chèvre")).toBe(normalizeSearchTerm("chèvre"));
  });

  it("borne la longueur pour éviter d'enregistrer des blocs de texte", () => {
    expect(normalizeSearchTerm("x".repeat(200)).length).toBe(60);
  });

  it("renvoie une chaîne vide pour une entrée vide (non journalisée)", () => {
    expect(normalizeSearchTerm("   ")).toBe("");
    expect(normalizeSearchTerm("")).toBe("");
  });
});
