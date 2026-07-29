import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "./slug.mjs";

describe("slug (identifiants stables §8)", () => {
  it("est déterministe : même entrée, même slug", () => {
    expect(slugify("eɣlan")).toBe(slugify("eɣlan"));
  });

  it("translittère lisiblement les caractères spéciaux", () => {
    expect(slugify("eɣlan")).toBe("eghlan");
    expect(slugify("aḍu")).toBe("adu");
    expect(slugify("əgməy")).toBe("egmey");
    expect(slugify("imẓad")).toBe("imzad");
  });

  it("gère le tifinagh comme le latin", () => {
    expect(slugify("ⴰⵎⴰⵏ")).toBe("aman");
  });

  it("nettoie ponctuation et espaces", () => {
    expect(slugify("Tén éré!")).toBe("ten-ere");
  });

  it("ne renvoie jamais un slug vide", () => {
    expect(slugify("")).toBe("entree");
    expect(slugify("!!!")).toBe("entree");
  });

  it("uniqueSlug désambiguïse par suffixe numérique déterministe", () => {
    const taken = new Set(["aman"]);
    expect(uniqueSlug("aman", taken)).toBe("aman-2");
    taken.add("aman-2");
    expect(uniqueSlug("aman", taken)).toBe("aman-3");
    expect(uniqueSlug("akal", taken)).toBe("akal");
  });
});
