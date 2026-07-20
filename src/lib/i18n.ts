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
  approximateHint: string;
  nav: { contribute: string; moderation: string; account: string };
  acc: {
    title: string; intro: string; pseudonym: string; pseudonymPh: string;
    modCode: string; modCodeHint: string; signIn: string; signOut: string;
    signedAs: string; role: string; reputation: string; mine: string; none: string;
    roleContributor: string; roleModerator: string;
  };
  contrib: {
    title: string; intro: string; mustSignIn: string; kind: string;
    kindNew: string; kindExample: string; kindVariant: string; forEntry: string;
    headword: string; tifinagh: string; ipa: string; pos: string; definition: string;
    trFr: string; trEn: string; trAr: string; area: string; sense: string;
    exampleText: string; exampleTr: string; variantForm: string; note: string;
    submit: string; sent: string; required: string; open: string;
  };
  mod: {
    title: string; intro: string; denied: string; empty: string;
    pending: string; approved: string; rejected: string; by: string; selfReview: string;
    approve: string; reject: string; reviewNote: string; history: string; applied: string;
  };
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
    approximateHint: "Aucune correspondance exacte — voici des résultats phonétiquement proches.",
    nav: { contribute: "Contribuer", moderation: "Modération", account: "Compte" },
    acc: {
      title: "Votre compte",
      intro: "Identité pseudonyme, sans mot de passe — prototype. L'authentification complète (OAuth2/OIDC, MFA) est prévue en v1.0.",
      pseudonym: "Pseudonyme", pseudonymPh: "ex. Moussa",
      modCode: "Code de modération (facultatif)",
      modCodeHint: "Réservé aux valideurs.",
      signIn: "Entrer", signOut: "Se déconnecter",
      signedAs: "Connecté en tant que", role: "Rôle", reputation: "Réputation",
      mine: "Mes contributions", none: "Aucune contribution pour l'instant.",
      roleContributor: "contributeur", roleModerator: "valideur",
    },
    contrib: {
      title: "Proposer un ajout",
      intro: "Toute proposition est relue par un valideur avant publication.",
      mustSignIn: "Choisissez d'abord un pseudonyme pour contribuer.",
      kind: "Type de proposition",
      kindNew: "Nouveau mot", kindExample: "Exemple d'usage", kindVariant: "Variante dialectale",
      forEntry: "Pour l'entrée",
      headword: "Mot (graphie latine)", tifinagh: "Tifinagh", ipa: "Prononciation (IPA)",
      pos: "Catégorie", definition: "Définition courte",
      trFr: "Traduction française", trEn: "Traduction anglaise", trAr: "Traduction arabe",
      area: "Aire dialectale", sense: "Sens visé",
      exampleText: "Phrase en tamasheq", exampleTr: "Traduction",
      variantForm: "Forme dans cette aire",
      note: "Note pour le valideur (facultatif)",
      submit: "Soumettre la proposition",
      sent: "Proposition envoyée — en attente de validation.",
      required: "Champs obligatoires manquants.",
      open: "Proposer un ajout",
    },
    mod: {
      title: "File de modération",
      intro: "Relisez les propositions, puis approuvez ou refusez avec un motif.",
      denied: "Accès réservé aux valideurs.",
      empty: "Aucune proposition en attente.",
      pending: "En attente", approved: "Approuvée", rejected: "Refusée",
      by: "par", approve: "Approuver", reject: "Refuser",
      selfReview: "Vous ne pouvez pas valider votre propre proposition — un autre valideur doit s'en charger.",
      reviewNote: "Motif (facultatif)",
      history: "Décisions récentes",
      applied: "Appliquée au lexique.",
    },
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
    approximateHint: "No exact match — here are phonetically close results.",
    nav: { contribute: "Contribute", moderation: "Moderation", account: "Account" },
    acc: {
      title: "Your account",
      intro: "Pseudonymous identity, no password — prototype. Full authentication (OAuth2/OIDC, MFA) is planned for v1.0.",
      pseudonym: "Pseudonym", pseudonymPh: "e.g. Moussa",
      modCode: "Moderation code (optional)",
      modCodeHint: "For reviewers only.",
      signIn: "Enter", signOut: "Sign out",
      signedAs: "Signed in as", role: "Role", reputation: "Reputation",
      mine: "My contributions", none: "No contributions yet.",
      roleContributor: "contributor", roleModerator: "reviewer",
    },
    contrib: {
      title: "Suggest an addition",
      intro: "Every suggestion is reviewed before it is published.",
      mustSignIn: "Pick a pseudonym first to contribute.",
      kind: "Type of suggestion",
      kindNew: "New word", kindExample: "Usage example", kindVariant: "Dialectal variant",
      forEntry: "For the entry",
      headword: "Word (Latin script)", tifinagh: "Tifinagh", ipa: "Pronunciation (IPA)",
      pos: "Part of speech", definition: "Short definition",
      trFr: "French translation", trEn: "English translation", trAr: "Arabic translation",
      area: "Dialect area", sense: "Target sense",
      exampleText: "Sentence in Tamasheq", exampleTr: "Translation",
      variantForm: "Form in this area",
      note: "Note for the reviewer (optional)",
      submit: "Submit suggestion",
      sent: "Suggestion sent — awaiting review.",
      required: "Required fields are missing.",
      open: "Suggest an addition",
    },
    mod: {
      title: "Moderation queue",
      intro: "Review suggestions, then approve or reject them with a reason.",
      denied: "Reviewers only.",
      empty: "No pending suggestions.",
      pending: "Pending", approved: "Approved", rejected: "Rejected",
      by: "by", approve: "Approve", reject: "Reject",
      selfReview: "You cannot review your own suggestion — another reviewer must handle it.",
      reviewNote: "Reason (optional)",
      history: "Recent decisions",
      applied: "Applied to the lexicon.",
    },
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
    approximateHint: "لا توجد مطابقة تامة — إليك نتائج قريبة صوتياً.",
    nav: { contribute: "المساهمة", moderation: "المراجعة", account: "الحساب" },
    acc: {
      title: "حسابك",
      intro: "هوية باسم مستعار، بدون كلمة مرور — نموذج أولي. المصادقة الكاملة (OAuth2/OIDC) مقررة في الإصدار 1.0.",
      pseudonym: "الاسم المستعار", pseudonymPh: "مثال: موسى",
      modCode: "رمز المراجعة (اختياري)",
      modCodeHint: "خاص بالمراجعين.",
      signIn: "دخول", signOut: "تسجيل الخروج",
      signedAs: "متصل باسم", role: "الدور", reputation: "السمعة",
      mine: "مساهماتي", none: "لا توجد مساهمات بعد.",
      roleContributor: "مساهم", roleModerator: "مراجع",
    },
    contrib: {
      title: "اقتراح إضافة",
      intro: "تُراجَع كل الاقتراحات قبل نشرها.",
      mustSignIn: "اختر اسماً مستعاراً أولاً للمساهمة.",
      kind: "نوع الاقتراح",
      kindNew: "كلمة جديدة", kindExample: "مثال استعمال", kindVariant: "تنويعة لهجية",
      forEntry: "للمدخل",
      headword: "الكلمة (بالحرف اللاتيني)", tifinagh: "تيفيناغ", ipa: "النطق (IPA)",
      pos: "القسم النحوي", definition: "تعريف مختصر",
      trFr: "الترجمة الفرنسية", trEn: "الترجمة الإنجليزية", trAr: "الترجمة العربية",
      area: "المنطقة اللهجية", sense: "المعنى المقصود",
      exampleText: "جملة بالتماشق", exampleTr: "الترجمة",
      variantForm: "الصيغة في هذه المنطقة",
      note: "ملاحظة للمراجع (اختياري)",
      submit: "إرسال الاقتراح",
      sent: "أُرسل الاقتراح — في انتظار المراجعة.",
      required: "حقول مطلوبة ناقصة.",
      open: "اقتراح إضافة",
    },
    mod: {
      title: "قائمة المراجعة",
      intro: "راجع الاقتراحات ثم اقبلها أو ارفضها مع ذكر السبب.",
      denied: "مخصص للمراجعين.",
      empty: "لا توجد اقتراحات معلّقة.",
      pending: "معلّق", approved: "مقبول", rejected: "مرفوض",
      by: "من", approve: "قبول", reject: "رفض",
      selfReview: "لا يمكنك مراجعة اقتراحك الخاص — يجب أن يتولاه مراجع آخر.",
      reviewNote: "السبب (اختياري)",
      history: "القرارات الأخيرة",
      applied: "طُبِّق على المعجم.",
    },
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
