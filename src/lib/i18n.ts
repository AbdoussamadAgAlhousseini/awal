// Awal — internationalisation de l'interface (FR / EN / AR)

export type Locale = "fr" | "en" | "ar";
export const LOCALES: Locale[] = ["fr", "en", "ar"];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as string[]).includes(v);
}

/** Sens d'écriture du document pour une langue donnée. */
export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

type Messages = {
  subtitle: string;
  tagline: string;
  heroSub: string;
  searchPlaceholder: string;
  searchBtn: string;
  searchAria: string;
  suggestionsAria: string;
  resultsFor: (n: number, q: string) => string;
  noResults: (q: string) => string;
  noResultsHint: string;
  back: string;
  root: string;
  frequency: string;
  register: string;
  etymology: string;
  variants: string;
  area: string;
  form: string;
  pronunciation: string;
  entryNote: string;
  langLabel: string;
  footerProverb: string;
  footerNote: string;
};

export const messages: Record<Locale, Messages> = {
  fr: {
    subtitle: "dictionnaire · v0.1",
    tagline: "Plateforme mondiale de la langue tamasheq",
    heroSub: "Cherchez un mot en latin, en tifinagh ou par son sens.",
    searchPlaceholder: "ex. aman, ⴰⵎⴰⵏ, eau…",
    searchBtn: "Chercher",
    searchAria: "Rechercher un mot",
    suggestionsAria: "Suggestions",
    resultsFor: (n, q) => `${n} résultat${n > 1 ? "s" : ""} pour « ${q} »`,
    noResults: (q) => `Aucun résultat pour « ${q} ».`,
    noResultsHint:
      "Dans la version complète : recherche phonétique, floue et suggestion « proposer ce mot ».",
    back: "← Retour à la recherche",
    root: "Racine",
    frequency: "Fréquence",
    register: "Registre",
    etymology: "Étymologie",
    variants: "Variantes dialectales",
    area: "Aire",
    form: "Forme",
    pronunciation: "Prononciation",
    entryNote:
      "Entrée d'exemple, non encore validée scientifiquement. Dans la version de référence : audio multi-locuteurs, synonymes/antonymes, collocations, proverbes, conjugaison et sources.",
    langLabel: "Langue",
    footerProverb: "l'eau, c'est l'âme. Une langue aussi.",
    footerNote: "Prototype de recherche · contenu lexical d'exemple à valider.",
  },
  en: {
    subtitle: "dictionary · v0.1",
    tagline: "The global platform for the Tamasheq language",
    heroSub: "Search for a word in Latin script, in Tifinagh, or by its meaning.",
    searchPlaceholder: "e.g. aman, ⴰⵎⴰⵏ, water…",
    searchBtn: "Search",
    searchAria: "Search for a word",
    suggestionsAria: "Suggestions",
    resultsFor: (n, q) => `${n} result${n > 1 ? "s" : ""} for “${q}”`,
    noResults: (q) => `No results for “${q}”.`,
    noResultsHint:
      "In the full version: phonetic search, fuzzy matching, and a “suggest this word” option.",
    back: "← Back to search",
    root: "Root",
    frequency: "Frequency",
    register: "Register",
    etymology: "Etymology",
    variants: "Dialectal variants",
    area: "Area",
    form: "Form",
    pronunciation: "Pronunciation",
    entryNote:
      "Example entry, not yet scientifically validated. In the reference version: multi-speaker audio, synonyms/antonyms, collocations, proverbs, conjugation and sources.",
    langLabel: "Language",
    footerProverb: "water is the soul. So is a language.",
    footerNote: "Research prototype · sample lexical content, to be validated.",
  },
  ar: {
    subtitle: "قاموس · v0.1",
    tagline: "المنصة العالمية للغة تماشق",
    heroSub: "ابحث عن كلمة بالحرف اللاتيني أو بالتيفيناغ أو حسب المعنى.",
    searchPlaceholder: "مثال: aman، ⴰⵎⴰⵏ، ماء…",
    searchBtn: "بحث",
    searchAria: "ابحث عن كلمة",
    suggestionsAria: "اقتراحات",
    resultsFor: (n, q) => `${n} ${n > 1 ? "نتائج" : "نتيجة"} عن « ${q} »`,
    noResults: (q) => `لا توجد نتائج عن « ${q} ».`,
    noResultsHint:
      "في النسخة الكاملة: بحث صوتي ومطابقة تقريبية وخيار « اقترح هذه الكلمة ».",
    back: "→ العودة إلى البحث",
    root: "الجذر",
    frequency: "التكرار",
    register: "المستوى اللغوي",
    etymology: "الأصل",
    variants: "التنويعات اللهجية",
    area: "المنطقة",
    form: "الصيغة",
    pronunciation: "النطق",
    entryNote:
      "مدخل نموذجي لم يُحقَّق علمياً بعد. في النسخة المرجعية: تسجيلات صوتية متعددة المتحدثين، والمرادفات والأضداد، والمتلازمات، والأمثال، والتصريف، والمصادر.",
    langLabel: "اللغة",
    footerProverb: "الماء هو الروح. واللغة كذلك.",
    footerNote: "نموذج بحثي · محتوى معجمي نموذجي، قيد التحقق.",
  },
};

// Étiquettes de catégorie grammaticale (le contenu est stocké en français).
const POS: Record<string, Record<Locale, string>> = {
  nom: { fr: "nom", en: "noun", ar: "اسم" },
  verbe: { fr: "verbe", en: "verb", ar: "فعل" },
  adjectif: { fr: "adjectif", en: "adjective", ar: "صفة" },
  adverbe: { fr: "adverbe", en: "adverb", ar: "ظرف" },
  pronom: { fr: "pronom", en: "pronoun", ar: "ضمير" },
  "nom propre": { fr: "nom propre", en: "proper noun", ar: "اسم عَلَم" },
};

export function posLabel(locale: Locale, pos: string): string {
  return POS[pos.toLowerCase()]?.[locale] ?? pos;
}

// Contenu multilingue de l'écran d'accueil (montré avant tout choix).
export const welcome = {
  kicker: "ⴰⵡⴰⵍ · Awal",
  titles: ["Choisissez votre langue", "Choose your language", "اختر لغتك"],
  subs: [
    "L'expérience se poursuivra dans la langue choisie.",
    "The rest of the experience will continue in the language you pick.",
    "ستُكمَّل التجربة باللغة التي تختارها.",
  ],
  cards: [
    { code: "fr", label: "Français", go: "Continuer →", dir: "ltr" as const },
    { code: "en", label: "English", go: "Continue →", dir: "ltr" as const },
    { code: "ar", label: "العربية", go: "→ متابعة", dir: "rtl" as const },
  ],
};
