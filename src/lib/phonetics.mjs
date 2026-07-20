// Awal — normalisation phonétique du tamasheq (§13 du dossier de conception).
// Module en .mjs pour être partagé par l'application (TS) et le script de seed (Node).
//
// Principe : le tamasheq, comme les langues amazighes, s'organise autour de racines
// consonantiques. La clé phonétique est donc un SQUELETTE CONSONANTIQUE : on retire
// les voyelles et on fusionne les consonnes régulièrement confondues à l'écrit
// (g/ɣ, k/q, t/ṭ, d/ḍ, s/ṣ, z/ẓ…). « amghar » et « amgar » donnent la même clé.

/** Tifinagh (néo-tifinagh Unicode) → latin simplifié. */
const TIFINAGH = {
  "ⴰ": "a", "ⴱ": "b", "ⴳ": "g", "ⴷ": "d", "ⴹ": "d", "ⴻ": "e", "ⴼ": "f",
  "ⴽ": "k", "ⵀ": "h", "ⵃ": "h", "ⵄ": "e", "ⵅ": "x", "ⵇ": "q", "ⵉ": "i",
  "ⵊ": "j", "ⵍ": "l", "ⵎ": "m", "ⵏ": "n", "ⵓ": "u", "ⵔ": "r", "ⵕ": "r",
  "ⵖ": "g", "ⵙ": "s", "ⵚ": "s", "ⵛ": "c", "ⵜ": "t", "ⵟ": "t", "ⵡ": "w",
  "ⵢ": "y", "ⵣ": "z", "ⵥ": "z", "ⵯ": "",
};

/** Vrai si la chaîne contient au moins un caractère tifinagh. */
export function hasTifinagh(s) {
  return /[ⴰ-⵿]/.test(String(s || ""));
}

export function translitTifinagh(s) {
  let out = "";
  for (const ch of String(s || "")) out += TIFINAGH[ch] !== undefined ? TIFINAGH[ch] : ch;
  return out;
}

function stripDiacritics(s) {
  // NFD sépare les diacritiques combinants : ḍ → d + point souscrit, é → e + accent.
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Forme normalisée « souple » : minuscules, sans diacritiques, digrammes réduits,
 * lettres doublées écrasées. Sert de base à la distance d'édition.
 */
export function looseNormalize(s) {
  let x = translitTifinagh(String(s || "")).toLowerCase();
  x = stripDiacritics(x);
  x = x.replace(/[ɣʁ]/g, "g").replace(/[ʕʔʼ']/g, "");
  x = x
    .replace(/tch/g, "c")
    .replace(/ch/g, "c")
    .replace(/sh/g, "c")
    .replace(/kh/g, "x")
    .replace(/gh/g, "g")
    .replace(/ph/g, "f")
    .replace(/dj/g, "j")
    // « ou » devant une voyelle note la semi-voyelle /w/ (graphie française :
    // « aoual » = awal) ; ailleurs c'est la voyelle /u/.
    .replace(/ou(?=[aeiouy])/g, "w")
    .replace(/ou/g, "u");
  x = x.replace(/[^a-z]/g, "");
  x = x.replace(/(.)\1+/g, "$1"); // consonnes/voyelles doublées → simples
  return x;
}

/** Classes de consonnes : les sons régulièrement confondus partagent un symbole. */
const CLASS = {
  b: "B", p: "B", v: "F", f: "F",
  m: "M", n: "N",
  t: "T", d: "D",
  s: "S", z: "Z", c: "C", j: "J",
  k: "K", q: "K", g: "G", x: "X", h: "H",
  l: "L", r: "R", w: "W", y: "Y",
};

/** Squelette consonantique normalisé — la clé phonétique stockée en base. */
export function phoneticKey(s) {
  const n = looseNormalize(s);
  let out = "";
  for (const ch of n) {
    const c = CLASS[ch];
    if (c && out[out.length - 1] !== c) out += c;
  }
  return out;
}

/** Distance de Levenshtein (itérative, O(n·m) mémoire O(m)). */
export function levenshtein(a, b) {
  a = String(a || "");
  b = String(b || "");
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const cur = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur.slice();
  }
  return prev[b.length];
}
