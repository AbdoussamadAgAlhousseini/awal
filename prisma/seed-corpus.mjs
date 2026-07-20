// Awal — contenu d'amorçage : encyclopédie (§9) et bibliothèque (§16).
//
// ⚠️ CONTENU DE DÉMONSTRATION. Les fiches sont volontairement rédigées à un niveau
// général et factuel ; elles n'ont PAS été relues par un comité scientifique.
// Les notices bibliographiques renvoient à des ouvrages réels, mais leurs métadonnées
// (année, éditeur, pagination) doivent être vérifiées sur les exemplaires avant
// toute publication : elles sont ici volontairement minimales.

export const DOCUMENTS = [
  {
    key: "foucauld",
    title: "Dictionnaire touareg–français (dialecte de l'Ahaggar)",
    author: "Charles de Foucauld",
    year: "1951",
    kind: "livre",
    language: "fr, tmh",
    rights: "open",
    rightsNote: "Œuvre ancienne, vraisemblablement dans le domaine public — statut à confirmer par juridiction.",
    description:
      "Dictionnaire monumental du tamahaq de l'Ahaggar, publié à titre posthume. Reste une référence majeure de la lexicographie touarègue, malgré une transcription et un cadre d'époque qui demandent une lecture critique.",
  },
  {
    key: "heath-grammar",
    title: "A Grammar of Tamashek (Tuareg of Mali)",
    author: "Jeffrey Heath",
    year: "2005",
    kind: "livre",
    language: "en",
    rights: "restricted",
    rightsNote: "Ouvrage sous droits — consultation encadrée, aucune diffusion du texte intégral.",
    description:
      "Grammaire descriptive de référence du tamasheq du Mali : phonologie, morphologie verbale et nominale, syntaxe. Base principale des paradigmes verbaux de la plateforme.",
  },
  {
    key: "heath-dict",
    title: "Dictionnaire tamachek–anglais–français",
    author: "Jeffrey Heath",
    year: "2006",
    kind: "livre",
    language: "tmh, en, fr",
    rights: "restricted",
    rightsNote: "Ouvrage sous droits — consultation encadrée.",
    description:
      "Dictionnaire trilingue du tamasheq du Mali, complémentaire de la grammaire du même auteur.",
  },
  {
    key: "prasse",
    title: "Travaux sur la langue touarègue",
    author: "Karl-G. Prasse",
    year: null,
    kind: "livre",
    language: "fr, da",
    rights: "unknown",
    rightsNote: "Statut des droits à clarifier avant toute mise à disposition.",
    description:
      "Ensemble de travaux de référence sur la phonétique, la morphologie et le lexique touaregs. Métadonnées à compléter titre par titre.",
  },
  {
    key: "imzad-unesco",
    title: "Pratiques et savoirs liés à l'imzad",
    author: "UNESCO — Patrimoine culturel immatériel",
    year: "2013",
    kind: "archive",
    language: "fr, en",
    rights: "open",
    rightsNote: "Notice institutionnelle publique.",
    url: "https://ich.unesco.org/fr/RL/00891",
    description:
      "Inscription des pratiques et savoirs liés à l'imzad des communautés touarègues d'Algérie, du Mali et du Niger sur la Liste représentative du patrimoine culturel immatériel de l'humanité.",
  },
  {
    key: "archives-orales",
    title: "Collecte d'archives orales (fonds à constituer)",
    author: null,
    year: null,
    kind: "audio",
    language: "tmh",
    rights: "unknown",
    rightsNote:
      "Aucun enregistrement versé à ce jour. Toute collecte devra recueillir le consentement explicite des locuteurs et préciser la licence.",
    description:
      "Emplacement réservé au fonds d'archives orales : récits, poésie, veillées. Vide à dessein — la plateforme n'invente pas de corpus.",
  },
];

export const ARTICLES = [
  {
    slug: "tagelmust",
    title: "Le tagelmust",
    category: "habitat",
    summary:
      "Le voile-turban masculin teint à l'indigo, pièce vestimentaire la plus emblématique de la société touarègue.",
    body: `Le tagelmust est une longue pièce d'étoffe enroulée autour de la tête et du bas du visage, portée par les hommes touaregs à partir de l'âge adulte. Il combine une fonction pratique — protection contre le soleil, le vent de sable et l'air sec du désert — et une fonction sociale forte : la manière de le porter, de le remonter ou de l'abaisser participe des codes de réserve et de respect.

La teinture à l'indigo, longtemps obtenue par des procédés de martelage de la matière colorante sur le tissu, laisse des reflets bleutés sur la peau. C'est de là que vient l'expression « hommes bleus », courante dans la littérature de voyage européenne — désignation extérieure, qu'il convient de ne pas confondre avec la manière dont les intéressés se nomment eux-mêmes (Kel Tamasheq, « ceux de la langue tamasheq »).

Le vêtement n'est pas un simple ornement : il inscrit visuellement l'appartenance, l'âge et la position sociale. Sa description exhaustive relève autant de l'ethnographie du vêtement que de l'étude des règles de comportement.`,
    lexemes: [],
    documents: ["foucauld"],
  },
  {
    slug: "imzad",
    title: "L'imzad",
    category: "musique",
    summary:
      "Vièle monocorde jouée par les femmes, inscrite au patrimoine culturel immatériel de l'humanité en 2013.",
    body: `L'imzad est un instrument à corde unique, dont la caisse est traditionnellement constituée d'une demi-calebasse recouverte d'une peau tendue, et que l'on joue avec un archet courbe. Sa pratique est féminine.

L'instrument accompagne des poèmes chantés ; le jeu de l'imzad et la parole poétique forment un ensemble indissociable, associé aux veillées et à des situations sociales codifiées. La transmission se fait de femme à femme, par imitation et fréquentation prolongée des joueuses expérimentées.

Les pratiques et savoirs liés à l'imzad des communautés touarègues d'Algérie, du Mali et du Niger ont été inscrits en 2013 sur la Liste représentative du patrimoine culturel immatériel de l'humanité de l'UNESCO. Cette inscription a accompagné plusieurs initiatives de transmission, la pratique étant considérée comme menacée.`,
    lexemes: [],
    documents: ["imzad-unesco"],
  },
  {
    slug: "tifinagh",
    title: "L'écriture tifinagh",
    category: "histoire",
    summary:
      "Système d'écriture alphabétique propre aux langues amazighes, dont l'usage touareg est le plus continu.",
    body: `Le tifinagh est une écriture consonantique d'origine ancienne, apparentée aux alphabets libyques attestés par l'épigraphie nord-africaine. Chez les Touaregs, son usage s'est maintenu de façon continue, notamment pour des inscriptions sur roche, des messages courts et des marques de propriété.

Le tracé est géométrique — points, traits, cercles — ce qui le rend adapté à la gravure. Les répertoires de signes varient selon les régions : plusieurs traditions locales coexistent, et il n'existe pas une forme unique qui serait « le » tifinagh.

À l'époque contemporaine, un tifinagh normalisé (dit néo-tifinagh) a été élaboré et codé dans le standard Unicode, ce qui permet son emploi numérique. Cette plateforme utilise ce répertoire Unicode pour l'affichage, tout en reconnaissant que les traditions touarègues régionales ne s'y réduisent pas.`,
    lexemes: [],
    documents: ["foucauld"],
  },
  {
    slug: "pastoralisme",
    title: "Pastoralisme et savoirs du désert",
    category: "pastoralisme",
    summary:
      "L'élevage mobile structure le calendrier, le vocabulaire et la connaissance fine du milieu saharo-sahélien.",
    body: `L'économie pastorale repose sur la mobilité des troupeaux — dromadaires, chèvres, moutons, bovins selon les zones — en fonction de la disponibilité de l'eau et des pâturages. Cette mobilité n'est pas errance : elle suit des itinéraires, des points d'eau et des droits d'usage connus et négociés.

Cette organisation a produit un lexique d'une grande précision : dénominations des animaux selon l'âge, le sexe et la robe ; vocabulaire des sols, des vents, des nuages et des types de pâturage ; noms de lieux liés à la présence d'eau. Documenter ce vocabulaire, c'est documenter un savoir écologique.

Les sécheresses majeures de la seconde moitié du XXᵉ siècle, les transformations politiques et les restrictions de mobilité ont profondément affecté ce système. La perte de pratique s'accompagne d'une érosion du vocabulaire correspondant, ce qui rend la collecte urgente.`,
    lexemes: [],
    documents: [],
  },
  {
    slug: "droit-coutumier",
    title: "Droit coutumier et organisation sociale",
    category: "coutume",
    summary:
      "Fiche à accès restreint : ce domaine requiert le consentement des détenteurs du savoir avant publication.",
    body: `Contenu non publié.`,
    sensitivity: "restricted",
    restrictionNote:
      "Le droit coutumier, l'organisation en groupes et les généalogies sont des savoirs sensibles. Conformément aux principes CARE retenus par la plateforme (§9), ils ne sont pas diffusés sans le consentement explicite des détenteurs du savoir et l'avis du comité culturel. Cette fiche existe pour rendre la règle visible, pas pour la contourner.",
    lexemes: [],
    documents: [],
  },
];
