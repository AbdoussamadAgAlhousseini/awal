import { describe, it, expect } from "vitest";
import { phoneticKey, looseNormalize, levenshtein, hasTifinagh, translitTifinagh } from "./phonetics.mjs";

describe("clé phonétique", () => {
  it("fusionne les consonnes confondues à l'écrit (gh/g, k/q)", () => {
    expect(phoneticKey("amghar")).toBe(phoneticKey("amgar"));
    expect(phoneticKey("akal")).toBe(phoneticKey("aqal"));
  });

  it("traite « ou » devant voyelle comme la semi-voyelle /w/", () => {
    // Régression : « aoual » (graphie française de awal) doit rejoindre « awal ».
    expect(phoneticKey("awal")).toBe(phoneticKey("aoual"));
  });

  it("unifie les trois écritures via translittération", () => {
    expect(phoneticKey("ⴰⵎⴰⵏ")).toBe(phoneticKey("aman"));
    expect(phoneticKey("ⴰⵡⴰⵍ")).toBe(phoneticKey("awal"));
  });

  it("retire les voyelles pour ne garder que le squelette consonantique", () => {
    expect(phoneticKey("aman")).toBe("MN");
    expect(phoneticKey("amghar")).toBe("MGR");
  });
});

describe("normalisation & distance", () => {
  it("looseNormalize retire diacritiques et doublons", () => {
    expect(looseNormalize("aḍu")).toBe("adu");
    expect(looseNormalize("amman")).toBe("aman");
  });

  it("Levenshtein mesure une faute de frappe", () => {
    expect(levenshtein("aman", "amane")).toBe(1);
    expect(levenshtein("aman", "aman")).toBe(0);
    expect(levenshtein("", "abc")).toBe(3);
  });
});

describe("tifinagh", () => {
  it("détecte la présence de tifinagh", () => {
    expect(hasTifinagh("ⴰⵎⴰⵏ")).toBe(true);
    expect(hasTifinagh("aman")).toBe(false);
  });

  it("translittère vers le latin", () => {
    expect(translitTifinagh("ⴰⵎⴰⵏ")).toBe("aman");
  });
});
