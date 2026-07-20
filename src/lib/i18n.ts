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
  nav: { learn: string; atlas: string; enc: string; lib: string; contribute: string; moderation: string; account: string };
  acc: {
    title: string; intro: string; pseudonym: string; pseudonymPh: string;
    modCode: string; modCodeHint: string; signIn: string; signOut: string;
    signedAs: string; role: string; reputation: string; mine: string; none: string;
    roleContributor: string; roleModerator: string;
  };
  contrib: {
    title: string; intro: string; mustSignIn: string; kind: string;
    kindNew: string; kindExample: string; kindVariant: string; kindAudio: string; forEntry: string;
    headword: string; tifinagh: string; ipa: string; pos: string; definition: string;
    trFr: string; trEn: string; trAr: string; area: string; sense: string;
    exampleText: string; exampleTr: string; variantForm: string; note: string;
    submit: string; sent: string; required: string; open: string;
  };
  learn: {
    title: string; intro: string; due: string; total: string; noCards: string;
    addToDeck: string; inDeck: string; remove: string; reveal: string;
    again: string; hard: string; good: string; easy: string;
    doneTitle: string; doneBody: string; nextIn: string; minutes: string; days: string;
    recognition: string; production: string; algo: string; signIn: string;
  };
  audio: {
    title: string; none: string; speaker: string; area: string; license: string;
    consentGate: string; addAudio: string; uri: string; speakerName: string;
    consentLabel: string; consentHelp: string; recordingNote: string;
  };
  enc: {
    title: string; intro: string; readMore: string; relatedTerms: string;
    furtherReading: string; restricted: string; restrictedTitle: string;
    categories: Record<string, string>; empty: string; area: string;
  };
  lib: {
    title: string; intro: string; author: string; year: string; language: string;
    kind: string; rights: string; open: string; restricted: string; unknown: string;
    consult: string; noViewer: string; kinds: Record<string, string>;
    inArticles: string; all: string; empty: string;
  };
  conj: {
    title: string; aspect: string; person: string; stem: string;
    notDocumented: string; attested: string; toValidate: string; note: string;
  };
  atlas: {
    title: string; intro: string; indicative: string; entries: string;
    variantHere: string; noVariant: string; distributionOf: string;
    allAreas: string; present: string; absent: string; viewOnAtlas: string; parlers: string;
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
    nav: { learn: "Apprendre", atlas: "Atlas", enc: "Encyclopédie", lib: "Bibliothèque", contribute: "Contribuer", moderation: "Modération", account: "Compte" },
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
      kindNew: "Nouveau mot", kindExample: "Exemple d'usage", kindVariant: "Variante dialectale", kindAudio: "Enregistrement",
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
    learn: {
      title: "Apprendre", intro: "Révisions en répétition espacée.", due: "à réviser", total: "cartes", noCards: "Votre paquet est vide. Ajoutez des mots depuis leur fiche.",
      addToDeck: "Ajouter à mes cartes", inDeck: "Dans mes cartes", remove: "Retirer du paquet", reveal: "Afficher la réponse",
      again: "À revoir", hard: "Difficile", good: "Correct", easy: "Facile",
      doneTitle: "Rien à réviser pour l'instant", doneBody: "Revenez plus tard : les cartes réapparaîtront à leur échéance.", nextIn: "prochaine révision dans", minutes: "min", days: "j",
      recognition: "Reconnaissance", production: "Production", algo: "Ordonnancement SM-2. Le dossier évoquait FSRS, qui suppose un modèle ajusté sur un historique de révisions ; SM-2 est retenu tant que cet historique n'existe pas.", signIn: "Connectez-vous pour réviser.",
    },
    audio: {
      title: "Prononciation", none: "Aucun enregistrement pour cette entrée. La collecte auprès de locuteurs reste à faire — la plateforme ne synthétise pas de prononciation.", speaker: "Locuteur", area: "Aire", license: "Licence",
      consentGate: "Seuls les enregistrements dont le locuteur a donné son consentement explicite sont diffusés.", addAudio: "Proposer un enregistrement", uri: "Adresse du fichier audio", speakerName: "Locuteur (pseudonyme)",
      consentLabel: "Le locuteur consent à la diffusion de cet enregistrement", consentHelp: "Obligatoire. Sans consentement explicite, la proposition est irrecevable.", recordingNote: "Contexte d'enregistrement (facultatif)",
    },
    enc: {
      title: "Encyclopédie", intro: "Fiches culturelles reliées au lexique.", readMore: "Lire la fiche",
      relatedTerms: "Termes liés", furtherReading: "À consulter",
      restrictedTitle: "Fiche à accès restreint", restricted: "Ce savoir est sensible et n'est pas diffusé sans le consentement de ses détenteurs.",
      empty: "Aucune fiche dans cette catégorie.", area: "Aire",
      categories: { histoire: "Histoire", oralite: "Traditions orales", musique: "Musique & poésie", artisanat: "Artisanat",
        pastoralisme: "Pastoralisme", habitat: "Habitat & vêtements", cosmologie: "Cosmologie", coutume: "Droit coutumier", nature: "Faune & flore" },
    },
    lib: {
      title: "Bibliothèque", intro: "Catalogue de références : livres, archives, enregistrements.", author: "Auteur", year: "Année",
      language: "Langue", kind: "Type", rights: "Droits",
      open: "libre", restricted: "consultation encadrée", unknown: "à clarifier",
      consult: "Consulter la source", noViewer: "Aucune visionneuse IIIF n'est branchée : la plateforme ne dispose ni de documents numérisés ni de serveur d'images. Le catalogue décrit les références, il ne les héberge pas.", inArticles: "Cité dans",
      all: "Tous", empty: "Aucun document de ce type.",
      kinds: { livre: "Livre", article: "Article", manuscrit: "Manuscrit", audio: "Audio", video: "Vidéo", archive: "Archive" },
    },
    conj: {
      title: "Conjugaison", aspect: "Aspect", person: "Personne", stem: "radical",
      notDocumented: "Radical non documenté pour cet aspect — aucune forme n'est générée.",
      attested: "attesté", toValidate: "à valider",
      note: "Le moteur fléchit les radicaux documentés ; il n'invente aucun radical manquant. Les affixes d'accord sont réguliers, les radicaux restent à confirmer par des locuteurs.",
    },
    atlas: {
      title: "Atlas linguistique", intro: "Répartition indicative des aires dialectales du tamasheq.",
      indicative: "Carte schématique. Le tamasheq est un continuum : ces zones sont indicatives, ce ne sont ni des isoglosses attestées ni des limites territoriales.",
      entries: "entrées", variantHere: "Forme dans cette aire", noVariant: "Pas de forme documentée ici",
      distributionOf: "Répartition de", allAreas: "Toutes les aires",
      present: "forme documentée", absent: "non documentée", viewOnAtlas: "Voir sur l'atlas",
      parlers: "Parlers",
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
    nav: { learn: "Learn", atlas: "Atlas", enc: "Encyclopedia", lib: "Library", contribute: "Contribute", moderation: "Moderation", account: "Account" },
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
      kindNew: "New word", kindExample: "Usage example", kindVariant: "Dialectal variant", kindAudio: "Recording",
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
    learn: {
      title: "Learn", intro: "Spaced-repetition review.", due: "due", total: "cards", noCards: "Your deck is empty. Add words from their entry page.",
      addToDeck: "Add to my cards", inDeck: "In my cards", remove: "Remove from deck", reveal: "Show answer",
      again: "Again", hard: "Hard", good: "Good", easy: "Easy",
      doneTitle: "Nothing due right now", doneBody: "Come back later: cards reappear when they are due.", nextIn: "next review in", minutes: "min", days: "d",
      recognition: "Recognition", production: "Production", algo: "SM-2 scheduling. The design dossier mentioned FSRS, which requires a model fitted on real review history; SM-2 is used until that history exists.", signIn: "Sign in to review.",
    },
    audio: {
      title: "Pronunciation", none: "No recording for this entry. Collection from speakers is still to be done — the platform does not synthesise pronunciation.", speaker: "Speaker", area: "Area", license: "Licence",
      consentGate: "Only recordings whose speaker gave explicit consent are served.", addAudio: "Suggest a recording", uri: "Audio file URL", speakerName: "Speaker (pseudonym)",
      consentLabel: "The speaker consents to this recording being published", consentHelp: "Required. Without explicit consent the suggestion is not admissible.", recordingNote: "Recording context (optional)",
    },
    enc: {
      title: "Encyclopedia", intro: "Cultural entries linked to the lexicon.", readMore: "Read the entry",
      relatedTerms: "Related terms", furtherReading: "Further reading",
      restrictedTitle: "Restricted entry", restricted: "This knowledge is sensitive and is not published without the consent of its holders.",
      empty: "No entry in this category.", area: "Area",
      categories: { histoire: "History", oralite: "Oral traditions", musique: "Music & poetry", artisanat: "Craft",
        pastoralisme: "Pastoralism", habitat: "Dwelling & dress", cosmologie: "Cosmology", coutume: "Customary law", nature: "Fauna & flora" },
    },
    lib: {
      title: "Library", intro: "Reference catalogue: books, archives, recordings.", author: "Author", year: "Year",
      language: "Language", kind: "Type", rights: "Rights",
      open: "open", restricted: "supervised access", unknown: "to clarify",
      consult: "View the source", noViewer: "No IIIF viewer is wired up: the platform has neither digitised documents nor an image server. The catalogue describes references, it does not host them.", inArticles: "Cited in",
      all: "All", empty: "No document of this type.",
      kinds: { livre: "Book", article: "Article", manuscrit: "Manuscript", audio: "Audio", video: "Video", archive: "Archive" },
    },
    conj: {
      title: "Conjugation", aspect: "Aspect", person: "Person", stem: "stem",
      notDocumented: "No documented stem for this aspect — no form is generated.",
      attested: "attested", toValidate: "to validate",
      note: "The engine inflects documented stems; it never invents a missing one. Agreement affixes are regular, but the stems still need confirmation by speakers.",
    },
    atlas: {
      title: "Linguistic atlas", intro: "Indicative distribution of Tamasheq dialect areas.",
      indicative: "Schematic map. Tamasheq is a continuum: these zones are indicative — they are neither attested isoglosses nor territorial boundaries.",
      entries: "entries", variantHere: "Form in this area", noVariant: "No form documented here",
      distributionOf: "Distribution of", allAreas: "All areas",
      present: "documented form", absent: "not documented", viewOnAtlas: "View on the atlas",
      parlers: "Varieties",
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
    nav: { learn: "التعلّم", atlas: "الأطلس", enc: "الموسوعة", lib: "المكتبة", contribute: "المساهمة", moderation: "المراجعة", account: "الحساب" },
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
      kindNew: "كلمة جديدة", kindExample: "مثال استعمال", kindVariant: "تنويعة لهجية", kindAudio: "تسجيل",
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
    learn: {
      title: "التعلّم", intro: "مراجعة بالتكرار المتباعد.", due: "للمراجعة", total: "بطاقات", noCards: "مجموعتك فارغة. أضف كلمات من صفحاتها.",
      addToDeck: "إضافة إلى بطاقاتي", inDeck: "في بطاقاتي", remove: "إزالة من المجموعة", reveal: "إظهار الجواب",
      again: "إعادة", hard: "صعب", good: "جيد", easy: "سهل",
      doneTitle: "لا شيء للمراجعة الآن", doneBody: "عد لاحقاً: تظهر البطاقات عند حلول موعدها.", nextIn: "المراجعة القادمة بعد", minutes: "د", days: "ي",
      recognition: "التعرّف", production: "الإنتاج", algo: "الجدولة بخوارزمية SM-2. ذكر الملف FSRS التي تتطلب نموذجاً مضبوطاً على سجل مراجعات حقيقي؛ تُعتمد SM-2 إلى أن يتوفر هذا السجل.", signIn: "سجّل الدخول للمراجعة.",
    },
    audio: {
      title: "النطق", none: "لا يوجد تسجيل لهذا المدخل. جمع التسجيلات من المتحدثين لم يتم بعد — والمنصة لا تصطنع النطق.", speaker: "المتحدث", area: "المنطقة", license: "الرخصة",
      consentGate: "لا تُنشر إلا التسجيلات التي وافق متحدثوها صراحةً.", addAudio: "اقتراح تسجيل", uri: "رابط الملف الصوتي", speakerName: "المتحدث (اسم مستعار)",
      consentLabel: "يوافق المتحدث على نشر هذا التسجيل", consentHelp: "إلزامي. بدون موافقة صريحة يُرفض الاقتراح.", recordingNote: "سياق التسجيل (اختياري)",
    },
    enc: {
      title: "الموسوعة", intro: "بطاقات ثقافية مرتبطة بالمعجم.", readMore: "قراءة البطاقة",
      relatedTerms: "مصطلحات ذات صلة", furtherReading: "للاطّلاع",
      restrictedTitle: "بطاقة ذات وصول مقيّد", restricted: "هذه المعرفة حسّاسة ولا تُنشر دون موافقة أصحابها.",
      empty: "لا توجد بطاقات في هذا التصنيف.", area: "المنطقة",
      categories: { histoire: "التاريخ", oralite: "التقاليد الشفوية", musique: "الموسيقى والشعر", artisanat: "الحِرَف",
        pastoralisme: "الرعي", habitat: "السكن واللباس", cosmologie: "علم الكون", coutume: "القانون العرفي", nature: "الحيوان والنبات" },
    },
    lib: {
      title: "المكتبة", intro: "فهرس المراجع: كتب وأرشيفات وتسجيلات.", author: "المؤلف", year: "السنة",
      language: "اللغة", kind: "النوع", rights: "الحقوق",
      open: "حر", restricted: "اطّلاع مؤطَّر", unknown: "قيد التوضيح",
      consult: "الاطلاع على المصدر", noViewer: "لا يوجد عارض IIIF: المنصة لا تملك وثائق مرقمنة ولا خادم صور. الفهرس يصف المراجع ولا يستضيفها.", inArticles: "مذكور في",
      all: "الكل", empty: "لا توجد وثائق من هذا النوع.",
      kinds: { livre: "كتاب", article: "مقال", manuscrit: "مخطوط", audio: "صوت", video: "فيديو", archive: "أرشيف" },
    },
    conj: {
      title: "التصريف", aspect: "الصيغة", person: "الضمير", stem: "الجذع",
      notDocumented: "لا يوجد جذع موثّق لهذه الصيغة — لم تُولَّد أي صيغة.",
      attested: "موثّق", toValidate: "قيد التحقق",
      note: "يصرّف المحرك الجذوع الموثّقة فقط ولا يخترع جذعاً ناقصاً. لواحق المطابقة منتظمة، أما الجذوع فتحتاج تأكيد المتحدثين.",
    },
    atlas: {
      title: "الأطلس اللغوي", intro: "التوزّع الإرشادي للمناطق اللهجية للتماشق.",
      indicative: "خريطة تخطيطية. التماشق سلسلة متصلة: هذه المناطق إرشادية، وليست حدوداً لهجية موثّقة ولا حدوداً إقليمية.",
      entries: "مداخل", variantHere: "الصيغة في هذه المنطقة", noVariant: "لا توجد صيغة موثّقة هنا",
      distributionOf: "توزّع", allAreas: "كل المناطق",
      present: "صيغة موثّقة", absent: "غير موثّقة", viewOnAtlas: "عرض على الأطلس",
      parlers: "اللهجات",
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
