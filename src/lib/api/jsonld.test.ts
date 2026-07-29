import { describe, it, expect } from "vitest";
import { lexemeToJSONLD, lexemeDocument, LEXICON_CONTEXT } from "./jsonld";

// Fausse entrée conforme à LexemeWithRelations (champs réellement lus par le sérialiseur).
const fake = {
  slug: "aman",
  headword: "aman",
  tifinagh: "ⴰⵎⴰⵏ",
  ipa: "/aˈman/",
  pos: "nom",
  etymology: "Proto-berbère *a-mān.",
  senses: [
    { order: 1, defShort: "Eau.", defLong: null, translations: JSON.stringify({ fr: "eau", en: "water", ar: "ماء" }) },
  ],
  variants: [{ form: "aman", ipa: null, area: { code: "taq-ML", country: "Mali" } }],
  verbStems: [],
} as never;

const BASE = "https://awal.example";

describe("Linked Data (Ontolex-Lemon)", () => {
  it("produit une LexicalEntry avec IRI stable dérivée du slug", () => {
    const node = lexemeToJSONLD(fake, BASE);
    expect(node["@type"]).toBe("LexicalEntry");
    expect(node["@id"]).toBe(`${BASE}/api/v1/lexemes/aman`);
    expect(node.language).toBe("tmh");
  });

  it("expose la forme canonique en latin ET en tifinagh étiqueté tmh-Tfng", () => {
    const node = lexemeToJSONLD(fake, BASE) as never as {
      canonicalForm: { writtenRep: { "@value": string; "@language": string }[] };
    };
    const reps = node.canonicalForm.writtenRep;
    expect(reps.some((r) => r["@value"] === "aman" && r["@language"] === "tmh")).toBe(true);
    expect(reps.some((r) => r["@value"] === "ⴰⵎⴰⵏ" && r["@language"] === "tmh-Tfng")).toBe(true);
  });

  it("mappe la catégorie sur le vocabulaire LexInfo", () => {
    const node = lexemeToJSONLD(fake, BASE) as never as Record<string, unknown>;
    expect(node["lexinfo:partOfSpeech"]).toBe("lexinfo:noun");
  });

  it("expose le sens avec définition SKOS et gloses multilingues", () => {
    const node = lexemeToJSONLD(fake, BASE) as never as {
      sense: { "skos:definition": string; "rdfs:label": { "@language": string }[] }[];
    };
    expect(node.sense[0]["skos:definition"]).toBe("Eau.");
    const langs = node.sense[0]["rdfs:label"].map((l) => l["@language"]).sort();
    expect(langs).toEqual(["ar", "en", "fr"]);
  });

  it("le document complet embarque le contexte des vocabulaires", () => {
    const doc = lexemeDocument(fake, BASE) as never as { "@context": typeof LEXICON_CONTEXT };
    expect(doc["@context"].ontolex).toContain("lemon/ontolex");
    expect(doc["@context"].dct).toContain("purl.org/dc/terms");
  });
});
