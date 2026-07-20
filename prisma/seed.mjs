// Awal — données d'amorçage (MVP v0.1)
// ⚠️ Contenu lexical d'EXEMPLE, à valider par des locuteurs et le comité scientifique
// avant toute publication de référence. Transcriptions simplifiées.

import { PrismaClient } from "@prisma/client";
import { phoneticKey } from "../src/lib/phonetics.mjs";
import { areaGeoJSON } from "../src/lib/geo.mjs";
import { slugify, uniqueSlug } from "../src/lib/slug.mjs";
import { ARTICLES, DOCUMENTS } from "./seed-corpus.mjs";
const db = new PrismaClient();

const AREAS = [
  { id: "ml", code: "taq-ML", country: "Mali", name: "Tamasheq (Adagh / Azawad)" },
  { id: "ne", code: "taq-NE", country: "Niger", name: "Tamajaq (Aïr / Tawllemmet)" },
  { id: "dz", code: "taq-DZ", country: "Algérie", name: "Tamahaq (Ahaggar)" },
  { id: "ly", code: "taq-LY", country: "Libye", name: "Tamahaq (Ajjer)" },
  { id: "bf", code: "taq-BF", country: "Burkina Faso", name: "Tamasheq (Oudalan)" },
];

const SOURCE = {
  citation: "Données d'amorçage Awal — à valider (littérature : Heath 2006 ; Prasse).",
  type: "note",
};

// Entrées d'exemple. tr = traductions {fr,en,ar}
const LEXEMES = [
  {
    headword: "aman", tifinagh: "ⴰⵎⴰⵏ", ipa: "/aˈman/", pos: "nom", gender: "masc.",
    number: "pluriel", register: "courant", frequency: "élevée", root: "M-N",
    etymology: "Proto-berbère *a-mān (« eau »).",
    senses: [
      { defShort: "Eau.", defLong: "Liquide vital ; ressource centrale de la vie pastorale et de la poésie touareg.",
        tr: { fr: "eau", en: "water", ar: "ماء" },
        examples: [{ text: "Aman d iman.", translation: "L'eau, c'est l'âme (proverbe)." }] },
      { defShort: "Point d'eau, source.", defLong: "Par métonymie, selon le contexte.",
        tr: { fr: "point d'eau", en: "water source", ar: "منهل" } },
    ],
    variants: [{ area: "ml", form: "aman" }, { area: "ne", form: "aman" }, { area: "dz", form: "aman" }],
  },
  {
    headword: "akal", tifinagh: "ⴰⴽⴰⵍ", ipa: "/aˈkal/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "K-L",
    etymology: "Racine berbère largement attestée.",
    senses: [
      { defShort: "Terre, sol, pays.", defLong: "La terre en tant que territoire, sol ou contrée d'appartenance.",
        tr: { fr: "terre, pays", en: "land, earth, country", ar: "أرض" },
        examples: [{ text: "Akal-nnegh.", translation: "Notre pays / notre terre." }] },
    ],
    variants: [{ area: "ml", form: "akal" }, { area: "ne", form: "akal" }, { area: "dz", form: "akal" }],
  },
  {
    headword: "tafukt", tifinagh: "ⵜⴰⴼⵓⴽⵜ", ipa: "/taˈfukt/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "élevée", root: "F-K",
    senses: [
      { defShort: "Soleil.", defLong: "L'astre du jour ; par extension, la chaleur, la lumière du jour.",
        tr: { fr: "soleil", en: "sun", ar: "شمس" } },
    ],
    variants: [{ area: "ml", form: "tafukt" }, { area: "ne", form: "tafukt" }, { area: "dz", form: "tafuk" }],
  },
  {
    headword: "ehad", tifinagh: "ⴻⵀⴰⴷ", ipa: "/eˈhad/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "H-D",
    senses: [
      { defShort: "Nuit.", defLong: "La période nocturne ; moment des veillées, des récits et de la poésie.",
        tr: { fr: "nuit", en: "night", ar: "ليل" } },
    ],
    variants: [{ area: "ml", form: "ehad" }, { area: "ne", form: "ehod" }],
  },
  {
    headword: "amghar", tifinagh: "ⴰⵎⵖⴰⵔ", ipa: "/amˈɣar/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "moyenne", root: "M-Gh-R",
    senses: [
      { defShort: "Ancien, chef, notable.", defLong: "Homme âgé et respecté ; responsable ou chef d'un groupe.",
        tr: { fr: "chef, ancien", en: "elder, chief", ar: "شيخ" } },
    ],
    variants: [{ area: "ml", form: "amghar" }, { area: "ne", form: "amghar" }],
  },
  {
    headword: "aḍu", tifinagh: "ⴰⴹⵓ", ipa: "/aˈdˤu/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "moyenne", root: "Ḍ-W",
    senses: [
      { defShort: "Vent.", defLong: "Mouvement de l'air ; le vent du désert.",
        tr: { fr: "vent", en: "wind", ar: "ريح" } },
    ],
    variants: [{ area: "ml", form: "aḍu" }, { area: "dz", form: "aḍu" }],
  },
  {
    headword: "afus", tifinagh: "ⴰⴼⵓⵙ", ipa: "/aˈfus/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "F-S",
    senses: [
      { defShort: "Main.", defLong: "Partie du corps ; symbolise aussi l'aide, l'action.",
        tr: { fr: "main", en: "hand", ar: "يد" } },
    ],
    variants: [{ area: "ml", form: "afus" }, { area: "ne", form: "afus" }],
  },
  {
    headword: "awal", tifinagh: "ⴰⵡⴰⵍ", ipa: "/aˈwal/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "W-L",
    etymology: "Racine amazighe *awal (« parole, mot »). Donne son nom à cette plateforme.",
    senses: [
      { defShort: "Parole, mot, discours.", defLong: "La parole, le langage ; ce qui est dit. Fondement de la transmission orale.",
        tr: { fr: "parole, mot", en: "word, speech", ar: "كلمة، كلام" },
        examples: [{ text: "Awal n-tamasheq.", translation: "La langue (litt. la parole) tamasheq." }] },
    ],
    variants: [{ area: "ml", form: "awal" }, { area: "ne", form: "awal" }, { area: "dz", form: "awal" }],
  },
  {
    headword: "tamsa", tifinagh: "ⵜⴰⵎⵙⴰ", ipa: "/tamˈsa/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "faible", root: "M-S",
    senses: [
      { defShort: "Amitié, entente.", defLong: "Lien d'amitié et de solidarité entre personnes.",
        tr: { fr: "amitié", en: "friendship", ar: "صداقة" } },
    ],
    variants: [{ area: "ml", form: "tamsa" }],
  },
  {
    headword: "eɣlan", tifinagh: "ⴻⵖⵍⴰⵏ", ipa: "/eɣˈlan/", pos: "verbe",
    register: "courant", frequency: "moyenne", root: "Gh-L-N",
    senses: [
      { defShort: "Être / devenir cher, précieux.", defLong: "Avoir de la valeur ; être aimé, estimé.",
        tr: { fr: "être précieux", en: "to be precious", ar: "أن يكون غالياً" } },
    ],
    variants: [{ area: "ml", form: "eɣlan" }],
  },
  {
    headword: "əgməy", tifinagh: "ⴻⴳⵎⴻⵢ", ipa: "/əgˈməj/", pos: "verbe",
    register: "courant", frequency: "moyenne", root: "G-M-Y",
    senses: [
      { defShort: "Chercher.", defLong: "Rechercher, quérir ; par extension, demander.",
        tr: { fr: "chercher", en: "to seek, to look for", ar: "بحث عن" } },
    ],
    variants: [{ area: "ml", form: "əgməy" }, { area: "ne", form: "əgmăy" }],
  },
];

// Radicaux verbaux par aspect (§12). Radicaux NUS, sans affixes d'accord.
// ⚠️ Formes proposées à partir de la littérature, toutes marquées non attestées :
// elles doivent être confirmées par des locuteurs avant d'être présentées comme
// référence. L'inaccompli de « eɣlan » est volontairement laissé non documenté
// pour que le moteur affiche « radical non documenté » plutôt que d'inventer.
const VERB_STEMS = {
  "eɣlan": { aoriste: "əɣlən", accompli: "ɣlan" },
  "əgməy": { aoriste: "əgməy", accompli: "əgmăy", inaccompli: "gămmăy" },
};

async function main() {
  console.log("→ Réinitialisation…");
  await db.articleLexeme.deleteMany();
  await db.articleDocument.deleteMany();
  await db.article.deleteMany();
  await db.verbStem.deleteMany();
  await db.revision.deleteMany();
  await db.contribution.deleteMany();
  await db.user.deleteMany();
  await db.example.deleteMany();
  await db.sense.deleteMany();
  await db.variant.deleteMany();
  await db.media.deleteMany();
  await db.lexeme.deleteMany();
  await db.root.deleteMany();
  await db.speaker.deleteMany();
  await db.source.deleteMany();
  await db.document.deleteMany();
  await db.area.deleteMany();

  for (const a of AREAS) await db.area.create({ data: { ...a, geojson: areaGeoJSON(a.id) } });
  const source = await db.source.create({ data: SOURCE });

  const takenSlugs = new Set();
  for (const lx of LEXEMES) {
    const root = lx.root
      ? await db.root.upsert({ where: { radicals: lx.root }, update: {}, create: { radicals: lx.root } })
      : null;

    // Slug calculé UNE fois, puis réservé : l'inverse produirait un suffixe parasite.
    const slug = uniqueSlug(slugify(lx.headword), takenSlugs);
    takenSlugs.add(slug);

    await db.lexeme.create({
      data: {
        slug,
        headword: lx.headword,
        tifinagh: lx.tifinagh,
        ipa: lx.ipa,
        pos: lx.pos,
        gender: lx.gender ?? null,
        number: lx.number ?? null,
        register: lx.register ?? null,
        frequency: lx.frequency ?? null,
        etymology: lx.etymology ?? null,
        phonetic: phoneticKey(lx.headword),
        rootId: root?.id ?? null,
        senses: {
          create: lx.senses.map((s, i) => ({
            order: i + 1,
            defShort: s.defShort,
            defLong: s.defLong ?? null,
            translations: JSON.stringify(s.tr ?? {}),
            examples: {
              create: (s.examples ?? []).map((e) => ({
                text: e.text,
                translation: e.translation ?? null,
                sourceId: source.id,
              })),
            },
          })),
        },
        variants: {
          create: (lx.variants ?? []).map((v) => ({ areaId: v.area, form: v.form, ipa: v.ipa ?? null })),
        },
      },
    });
  }

  // Radicaux verbaux
  let stemCount = 0;
  for (const [headword, stems] of Object.entries(VERB_STEMS)) {
    const lx = await db.lexeme.findFirst({ where: { headword } });
    if (!lx) continue;
    for (const [aspect, stem] of Object.entries(stems)) {
      await db.verbStem.create({
        data: { lexemeId: lx.id, aspect, stem, attested: false, source: "À valider avec des locuteurs." },
      });
      stemCount++;
    }
  }

  // Bibliothèque numérique (§16)
  const docIds = {};
  for (const d of DOCUMENTS) {
    const { key, ...data } = d;
    const doc = await db.document.create({ data });
    docIds[key] = doc.id;
  }

  // Encyclopédie culturelle (§9)
  for (const a of ARTICLES) {
    const { lexemes = [], documents = [], ...data } = a;
    const article = await db.article.create({ data });
    for (const hw of lexemes) {
      const lx = await db.lexeme.findFirst({ where: { headword: hw } });
      if (lx) await db.articleLexeme.create({ data: { articleId: article.id, lexemeId: lx.id } });
    }
    for (const key of documents) {
      if (docIds[key]) await db.articleDocument.create({ data: { articleId: article.id, documentId: docIds[key] } });
    }
  }

  // Comptes de démonstration (identité pseudonyme, sans mot de passe — cf. README)
  await db.user.create({ data: { pseudonym: "Fadimata", role: "moderator", reputation: 120 } });
  await db.user.create({ data: { pseudonym: "Moussa", role: "contributor", reputation: 15 } });

  const n = await db.lexeme.count();
  const na = await db.article.count(), nd = await db.document.count();
  console.log(`✓ Amorçage terminé : ${n} entrées, ${AREAS.length} aires, ${stemCount} radicaux verbaux, ${na} fiches encyclopédiques, ${nd} documents, 2 comptes.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
