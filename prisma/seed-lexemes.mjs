// Awal — enrichissement du lexique (§8).
//
// ⚠️ CONTENU D'AMORÇAGE, À VALIDER. Ces entrées reprennent du vocabulaire tamasheq
// largement attesté dans la littérature (Foucauld, Heath, Prasse), mais :
//   - les transcriptions latines sont simplifiées et peuvent varier selon les aires ;
//   - les formes tifinagh sont vocalisées (néo-tifinagh) à titre lisible ;
//   - l'API et l'interface les présentent explicitement comme non encore validées.
// Un·e lexicographe et des locuteurs doivent les vérifier avant tout usage de référence.
//
// Choix : lot volontairement CONSERVATEUR (vocabulaire de base stable) plutôt qu'une
// longue liste de formes incertaines. Les racines ne sont indiquées que lorsqu'elles
// sont raisonnablement sûres et qu'elles ne fusionnent pas des mots sans rapport.

const V = (area, form, ipa) => (ipa ? { area, form, ipa } : { area, form });

export const EXTRA_LEXEMES = [
  // ── Nature & environnement ────────────────────────────────────────────────
  {
    headword: "adɣaɣ", tifinagh: "ⴰⴷⵖⴰⵖ", ipa: "/adˈɣaɣ/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "moyenne",
    senses: [{ defShort: "Pierre, rocher.", defLong: "Bloc de roche ; par extension, montagne rocheuse.",
      tr: { fr: "pierre, rocher", en: "stone, rock", ar: "حجر، صخرة" } }],
    variants: [V("ml", "adɣaɣ")],
  },
  {
    headword: "tenere", tifinagh: "ⵜⴻⵏⴻⵔⴻ", ipa: "/teˈnere/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "moyenne",
    etymology: "À l'origine du toponyme « Ténéré ».",
    senses: [{ defShort: "Désert, étendue vide.", defLong: "Plaine déserte, région sans repères ni points d'eau.",
      tr: { fr: "désert", en: "desert, wilderness", ar: "صحراء" } }],
    variants: [V("ml", "tenere"), V("ne", "teneré")],
  },
  {
    headword: "amaḍal", tifinagh: "ⴰⵎⴰⴹⴰⵍ", ipa: "/amaˈdˤal/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "moyenne", root: "M-Ḍ-L",
    senses: [{ defShort: "Monde, terre.", defLong: "L'ensemble du monde habité.",
      tr: { fr: "monde", en: "world, earth", ar: "عالم" } }],
    variants: [V("ml", "amaḍal")],
  },
  {
    headword: "tafawt", tifinagh: "ⵜⴰⴼⴰⵡⵜ", ipa: "/taˈfawt/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "moyenne",
    senses: [{ defShort: "Lumière, clarté.",
      tr: { fr: "lumière", en: "light", ar: "نور، ضوء" } }],
    variants: [V("ml", "tafawt")],
  },
  {
    headword: "timsi", tifinagh: "ⵜⵉⵎⵙⵉ", ipa: "/timˈsi/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "élevée",
    senses: [{ defShort: "Feu.", tr: { fr: "feu", en: "fire", ar: "نار" } }],
    variants: [V("ml", "timsi"), V("ne", "təmse")],
  },

  // ── Corps ─────────────────────────────────────────────────────────────────
  {
    headword: "eɣef", tifinagh: "ⴻⵖⴻⴼ", ipa: "/eˈɣef/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "Gh-F",
    senses: [{ defShort: "Tête.", defLong: "Partie du corps ; par extension, sommet, chef.",
      tr: { fr: "tête", en: "head", ar: "رأس" } }],
    variants: [V("ml", "eɣef")],
  },
  {
    headword: "tiṭ", tifinagh: "ⵜⵉⵟ", ipa: "/titˤ/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "élevée",
    senses: [{ defShort: "Œil.", defLong: "Organe de la vue ; par extension, source (d'eau).",
      tr: { fr: "œil", en: "eye", ar: "عين" } }],
    variants: [V("ml", "tiṭ")],
  },
  {
    headword: "imi", tifinagh: "ⵉⵎⵉ", ipa: "/iˈmi/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée",
    senses: [{ defShort: "Bouche.", defLong: "Par extension : ouverture, entrée, embouchure.",
      tr: { fr: "bouche", en: "mouth", ar: "فم" } }],
    variants: [V("ml", "imi")],
  },
  {
    headword: "ul", tifinagh: "ⵓⵍ", ipa: "/ul/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée",
    senses: [{ defShort: "Cœur.", defLong: "Organe ; siège des sentiments dans la poésie.",
      tr: { fr: "cœur", en: "heart", ar: "قلب" } }],
    variants: [V("ml", "ul")],
  },
  {
    headword: "aḍar", tifinagh: "ⴰⴹⴰⵔ", ipa: "/aˈdˤar/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "Ḍ-R",
    senses: [{ defShort: "Pied, jambe.", tr: { fr: "pied, jambe", en: "foot, leg", ar: "قدم، رِجل" } }],
    variants: [V("ml", "aḍar")],
  },

  // ── Animaux & pastoralisme ────────────────────────────────────────────────
  {
    headword: "taɣaṭ", tifinagh: "ⵜⴰⵖⴰⵟ", ipa: "/taˈɣatˤ/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "élevée", root: "Gh-Ṭ",
    senses: [{ defShort: "Chèvre.", tr: { fr: "chèvre", en: "goat", ar: "عنزة، ماعز" } }],
    variants: [V("ml", "taɣaṭ")],
  },
  {
    headword: "aləm", tifinagh: "ⴰⵍⴻⵎ", ipa: "/aˈləm/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "L-M",
    senses: [{ defShort: "Chameau, dromadaire.",
      defLong: "Le dromadaire ; selon l'usage et l'aire, d'autres termes précisent l'âge et la fonction (monture, bât).",
      tr: { fr: "chameau", en: "camel", ar: "جمل" } }],
    variants: [V("ml", "aləm")],
  },
  {
    headword: "afunas", tifinagh: "ⴰⴼⵓⵏⴰⵙ", ipa: "/afuˈnas/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "moyenne", root: "F-N-S",
    senses: [{ defShort: "Bœuf, bovin.", tr: { fr: "bœuf", en: "ox, cattle", ar: "ثور، بقر" } }],
    variants: [V("ml", "afunas")],
  },
  {
    headword: "tagəlla", tifinagh: "ⵜⴰⴳⴻⵍⵍⴰ", ipa: "/taˈɡəlla/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "moyenne", root: "G-L",
    senses: [{ defShort: "Galette, pain de mil.",
      defLong: "Pain sans levain cuit sous la cendre, aliment de base.",
      tr: { fr: "galette, pain", en: "flatbread", ar: "خبز" } }],
    variants: [V("ml", "tagəlla")],
  },

  // ── Personnes & parenté ───────────────────────────────────────────────────
  {
    headword: "ales", tifinagh: "ⴰⵍⴻⵙ", ipa: "/aˈles/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "élevée", root: "L-S",
    senses: [{ defShort: "Homme.", defLong: "Être humain de sexe masculin ; personne.",
      tr: { fr: "homme", en: "man", ar: "رجل" } }],
    variants: [V("ml", "ales")],
  },
  {
    headword: "abba", tifinagh: "ⴰⴱⴱⴰ", ipa: "/abˈba/", pos: "nom", gender: "masc.",
    number: "singulier", register: "familier", frequency: "élevée",
    senses: [{ defShort: "Père.", tr: { fr: "père", en: "father", ar: "أب" } }],
    variants: [V("ml", "abba")],
  },
  {
    headword: "anna", tifinagh: "ⴰⵏⵏⴰ", ipa: "/anˈna/", pos: "nom", gender: "fém.",
    number: "singulier", register: "familier", frequency: "élevée",
    senses: [{ defShort: "Mère.", tr: { fr: "mère", en: "mother", ar: "أم" } }],
    variants: [V("ml", "anna")],
  },

  // ── Nombres (1 à 5) ───────────────────────────────────────────────────────
  {
    headword: "iyyan", tifinagh: "ⵉⵢⵢⴰⵏ", ipa: "/ijˈjan/", pos: "numéral",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Un.", defLong: "Forme masculine ; féminin « iyyat ».",
      tr: { fr: "un", en: "one", ar: "واحد" } }],
    variants: [V("ml", "iyyan")],
  },
  {
    headword: "əššin", tifinagh: "ⴻⵛⵛⵉⵏ", ipa: "/əʃˈʃin/", pos: "numéral",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Deux.", tr: { fr: "deux", en: "two", ar: "اثنان" } }],
    variants: [V("ml", "əššin")],
  },
  {
    headword: "karad", tifinagh: "ⴽⴰⵔⴰⴷ", ipa: "/kaˈrad/", pos: "numéral",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Trois.", tr: { fr: "trois", en: "three", ar: "ثلاثة" } }],
    variants: [V("ml", "karad")],
  },
  {
    headword: "əkkoz", tifinagh: "ⴻⴽⴽⵓⵣ", ipa: "/əkˈkoz/", pos: "numéral",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Quatre.", tr: { fr: "quatre", en: "four", ar: "أربعة" } }],
    variants: [V("ml", "əkkoz")],
  },
  {
    headword: "səmmos", tifinagh: "ⵙⴻⵎⵎⵓⵙ", ipa: "/səmˈmos/", pos: "numéral",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Cinq.", tr: { fr: "cinq", en: "five", ar: "خمسة" } }],
    variants: [V("ml", "səmmos")],
  },

  // ── Verbes courants (sans radicaux d'aspect : non renseignés ici) ─────────
  {
    headword: "əsu", tifinagh: "ⴻⵙⵓ", ipa: "/əˈsu/", pos: "verbe",
    register: "courant", frequency: "élevée", root: "S-W",
    senses: [{ defShort: "Boire.", tr: { fr: "boire", en: "to drink", ar: "شرب" } }],
    variants: [V("ml", "əsu")],
  },
  {
    headword: "ətš", tifinagh: "ⴻⵜⵛ", ipa: "/ətʃ/", pos: "verbe",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Manger.", tr: { fr: "manger", en: "to eat", ar: "أكل" } }],
    variants: [V("ml", "ətš")],
  },
  {
    headword: "as", tifinagh: "ⴰⵙ", ipa: "/as/", pos: "verbe",
    register: "courant", frequency: "élevée",
    senses: [{ defShort: "Venir, arriver.", tr: { fr: "venir", en: "to come", ar: "أتى، جاء" } }],
    variants: [V("ml", "as")],
  },

  // ── Culture (reliés aux fiches encyclopédiques) ───────────────────────────
  {
    headword: "tagelmust", tifinagh: "ⵜⴰⴳⴻⵍⵎⵓⵙⵜ", ipa: "/taɡəlˈmust/", pos: "nom", gender: "fém.",
    number: "singulier", register: "courant", frequency: "moyenne",
    senses: [{ defShort: "Voile-turban indigo.",
      defLong: "Longue étoffe enroulée autour de la tête et du bas du visage, portée par les hommes.",
      tr: { fr: "voile, chèche", en: "veil, turban", ar: "لثام، عمامة" } }],
    variants: [V("ml", "tagelmust")],
  },
  {
    headword: "imẓad", tifinagh: "ⵉⵎⵥⴰⴷ", ipa: "/imˈzˤad/", pos: "nom", gender: "masc.",
    number: "singulier", register: "courant", frequency: "faible",
    senses: [{ defShort: "Vièle monocorde.",
      defLong: "Instrument à corde unique joué par les femmes, associé à la poésie chantée.",
      tr: { fr: "vièle monocorde", en: "one-string fiddle", ar: "إمزاد" } }],
    variants: [V("ml", "imẓad")],
  },
  {
    headword: "tifinaɣ", tifinagh: "ⵜⵉⴼⵉⵏⴰⵖ", ipa: "/tifiˈnaɣ/", pos: "nom", gender: "fém.",
    number: "pluriel", register: "courant", frequency: "moyenne",
    senses: [{ defShort: "Écriture tifinagh.",
      defLong: "Système d'écriture propre aux langues amazighes, d'usage continu chez les Touaregs.",
      tr: { fr: "tifinagh (écriture)", en: "Tifinagh (script)", ar: "تيفيناغ" } }],
    variants: [V("ml", "tifinaɣ")],
  },
];
