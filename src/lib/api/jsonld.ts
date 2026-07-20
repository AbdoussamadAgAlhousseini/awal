// Awal — Linked Data (§22).
//
// Chaque entrée est exposée en JSON-LD aligné sur ONTOLEX-LEMON (le modèle W3C pour
// les lexiques numériques) et DUBLIN CORE (pour les métadonnées). Cela rend le
// lexique interopérable : un tiers peut le moissonner, le lier à Wikidata, le charger
// dans un triplestore, sans connaître le format propre à Awal.
//
// Choix : on reste sur du JSON-LD (et non RDF/XML ou Turtle) — c'est le sérialisation
// la plus simple à produire et à consommer côté web, tout en restant du RDF valide.

import type { LexemeWithRelations } from "./serialize";

/** Contexte partagé : préfixes des vocabulaires utilisés. */
export const LEXICON_CONTEXT = {
  "@vocab": "http://www.w3.org/ns/lemon/ontolex#",
  ontolex: "http://www.w3.org/ns/lemon/ontolex#",
  lexinfo: "http://www.lexinfo.net/ontology/3.0/lexinfo#",
  dct: "http://purl.org/dc/terms/",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  skos: "http://www.w3.org/2004/02/skos/core#",
  writtenRep: "ontolex:writtenRep",
  phoneticRep: "ontolex:phoneticRep",
  language: "dct:language",
} as const;

function parseTr(json: string | null): Record<string, string> {
  if (!json) return {};
  try {
    return JSON.parse(json) as Record<string, string>;
  } catch {
    return {};
  }
}

// Catégorie grammaticale → LexInfo (vocabulaire de référence pour l'interopérabilité).
const POS_LEXINFO: Record<string, string> = {
  nom: "lexinfo:noun",
  verbe: "lexinfo:verb",
  adjectif: "lexinfo:adjective",
  adverbe: "lexinfo:adverb",
  pronom: "lexinfo:pronoun",
  "nom propre": "lexinfo:properNoun",
};

/**
 * Entrée → nœud JSON-LD Ontolex.
 * @param base origine absolue (ex. https://awal.example) pour construire les IRI.
 */
export function lexemeToJSONLD(lx: LexemeWithRelations, base: string) {
  const id = `${base}/api/v1/lexemes/${lx.slug}`;

  const senses = lx.senses.map((s, i) => {
    const tr = parseTr(s.translations);
    return {
      "@id": `${id}#sense-${s.order ?? i + 1}`,
      "@type": "LexicalSense",
      "skos:definition": s.defShort,
      // Les traductions sont exprimées comme des gloses multilingues.
      "rdfs:label": [
        ...(tr.fr ? [{ "@value": tr.fr, "@language": "fr" }] : []),
        ...(tr.en ? [{ "@value": tr.en, "@language": "en" }] : []),
        ...(tr.ar ? [{ "@value": tr.ar, "@language": "ar" }] : []),
      ],
    };
  });

  // Chaque variante dialectale est une autre « forme » du même lexème.
  const otherForms = lx.variants.map((v) => ({
    "@type": "Form",
    writtenRep: { "@value": v.form, "@language": "tmh" },
    ...(v.ipa ? { phoneticRep: v.ipa } : {}),
    "dct:spatial": v.area.country,
  }));

  return {
    "@id": id,
    "@type": "LexicalEntry",
    language: "tmh", // ISO 639-3 du tamasheq
    "lexinfo:partOfSpeech": POS_LEXINFO[lx.pos.toLowerCase()] ?? lx.pos,
    canonicalForm: {
      "@type": "Form",
      writtenRep: [
        { "@value": lx.headword, "@language": "tmh" },
        { "@value": lx.tifinagh, "@language": "tmh-Tfng" }, // sous-étiquette « écriture tifinagh »
      ],
      ...(lx.ipa ? { phoneticRep: lx.ipa } : {}),
    },
    ...(otherForms.length ? { otherForm: otherForms } : {}),
    sense: senses,
    ...(lx.etymology ? { "dct:description": lx.etymology } : {}),
  };
}

/** Document JSON-LD complet pour une entrée unique. */
export function lexemeDocument(lx: LexemeWithRelations, base: string) {
  return {
    "@context": LEXICON_CONTEXT,
    ...lexemeToJSONLD(lx, base),
  };
}

/** Jeu de données JSON-LD : le lexique entier comme `ontolex:Lexicon`. */
export function lexiconDocument(lexemes: LexemeWithRelations[], base: string) {
  return {
    "@context": LEXICON_CONTEXT,
    "@id": `${base}/api/v1/lexicon.jsonld`,
    "@type": "Lexicon",
    language: "tmh",
    "dct:title": "Awal — lexique tamasheq",
    "dct:license": "https://creativecommons.org/licenses/by-sa/4.0/",
    "dct:rights": "Contenu d'amorçage à valider — voir la plateforme.",
    entry: lexemes.map((lx) => lexemeToJSONLD(lx, base)),
  };
}
