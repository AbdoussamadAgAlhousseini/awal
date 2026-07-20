// Awal — moteur de conjugaison du tamasheq (§12 du dossier de conception).
//
// PRINCIPE ET LIMITE ASSUMÉE
// La conjugaison berbère se décompose en deux parties de nature très différente :
//
//   1. L'AFFIXATION PERSONNELLE (préfixes/suffixes d'accord) est très régulière et
//      partagée par l'ensemble des parlers. C'est elle que ce moteur génère.
//   2. LE RADICAL DE CHAQUE ASPECT (aoriste, accompli, inaccompli…) dépend de la
//      classe du verbe et comporte de nombreuses irrégularités. Le moteur ne
//      l'INVENTE PAS : il fléchit les radicaux documentés en base et signale
//      explicitement les aspects dont le radical est absent.
//
// Ce choix est délibéré : produire une forme fausse avec l'autorité d'un dictionnaire
// de référence est plus nuisible que d'afficher « non documenté ».

export const ASPECTS = ["aoriste", "accompli", "inaccompli", "accompli_negatif"];

export const ASPECT_LABELS = {
  aoriste: { fr: "Aoriste", en: "Aorist", ar: "الصيغة الأصلية" },
  accompli: { fr: "Accompli", en: "Perfective", ar: "التام" },
  inaccompli: { fr: "Inaccompli", en: "Imperfective", ar: "غير التام" },
  accompli_negatif: { fr: "Accompli négatif", en: "Negative perfective", ar: "التام المنفي" },
};

/**
 * Affixes d'accord. Forme simplifiée et normalisée : les parlers varient
 * (notamment 2sg -ăd / -ăt, et la voyelle d'appui ă/ə). À valider par aire.
 */
export const PERSONS = [
  { code: "1s",  prefix: "",   suffix: "ăɣ",  fr: "1re sing.",      en: "1sg",     ar: "أنا" },
  { code: "2s",  prefix: "tə", suffix: "ăd",  fr: "2e sing.",       en: "2sg",     ar: "أنتَ/أنتِ" },
  { code: "3sm", prefix: "i",  suffix: "",    fr: "3e sing. masc.", en: "3sg m",   ar: "هو" },
  { code: "3sf", prefix: "tə", suffix: "",    fr: "3e sing. fém.",  en: "3sg f",   ar: "هي" },
  { code: "1p",  prefix: "nə", suffix: "",    fr: "1re plur.",      en: "1pl",     ar: "نحن" },
  { code: "2pm", prefix: "tə", suffix: "ăm",  fr: "2e plur. masc.", en: "2pl m",   ar: "أنتم" },
  { code: "2pf", prefix: "tə", suffix: "măt", fr: "2e plur. fém.",  en: "2pl f",   ar: "أنتن" },
  { code: "3pm", prefix: "",   suffix: "ăn",  fr: "3e plur. masc.", en: "3pl m",   ar: "هم" },
  { code: "3pf", prefix: "",   suffix: "năt", fr: "3e plur. fém.",  en: "3pl f",   ar: "هن" },
];

const VOWELS = "aeiouăəɐɛ";

/** Jonction préfixe + radical : gère l'hiatus sans jamais effacer la marque d'accord. */
function joinPrefix(prefix, stem) {
  if (!prefix) return stem;
  const first = stem[0] ?? "";
  if (!VOWELS.includes(first)) return prefix + stem;

  // Le préfixe de 3e masc. « i- » se consonantise en « y- » devant voyelle
  // (alternance i ~ y régulière en berbère) : sans cela il disparaîtrait
  // entièrement et la forme serait confondue avec le radical nu.
  if (prefix === "i") return "y" + stem;

  // Les préfixes à voyelle d'appui (tə-, nə-) ne perdent que cette voyelle.
  if (prefix.length > 1 && VOWELS.includes(prefix[prefix.length - 1])) {
    return prefix.slice(0, -1) + stem;
  }
  return prefix + stem;
}

/** Jonction radical + suffixe : évite la collision de deux voyelles identiques. */
function joinSuffix(stem, suffix) {
  if (!suffix) return stem;
  const last = stem[stem.length - 1] ?? "";
  if (VOWELS.includes(last) && VOWELS.includes(suffix[0])) {
    return stem + suffix.slice(1);
  }
  return stem + suffix;
}

/** Fléchit un radical pour une personne donnée. */
export function inflect(stem, person) {
  if (!stem) return null;
  return joinPrefix(person.prefix, joinSuffix(stem, person.suffix));
}

/**
 * Construit le paradigme complet.
 * @param {Array<{aspect:string, stem:string, attested:boolean}>} stems radicaux documentés
 * @returns {Array<{aspect:string, documented:boolean, attested:boolean, forms:Array}>}
 */
export function buildParadigm(stems) {
  const byAspect = new Map(stems.map((s) => [s.aspect, s]));

  return ASPECTS.map((aspect) => {
    const entry = byAspect.get(aspect);
    if (!entry || !entry.stem) {
      // Radical inconnu : on ne fabrique rien.
      return { aspect, documented: false, attested: false, stem: null, forms: [] };
    }
    return {
      aspect,
      documented: true,
      attested: Boolean(entry.attested),
      stem: entry.stem,
      forms: PERSONS.map((p) => ({ person: p, form: inflect(entry.stem, p) })),
    };
  });
}
