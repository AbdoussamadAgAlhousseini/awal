// Awal — identifiants stables et citables (§8).
//
// POURQUOI
// Jusqu'ici les URL de fiches reposaient sur l'identifiant technique (cuid), régénéré
// à chaque ré-amorçage : toute URL citée devenait caduque. Un ouvrage de référence ne
// peut pas se permettre des liens qui pourrissent.
//
// Le slug est dérivé DÉTERMINISTEMENT de la forme vedette : la même entrée produit
// toujours la même URL, quelle que soit la base. Le cuid reste la clé primaire interne ;
// seul le slug est exposé.

/** Translittération lisible, distincte de la clé phonétique (qui, elle, fusionne des classes). */
const MAP = {
  "ɣ": "gh", "ʁ": "gh", "ʕ": "a", "ʔ": "", "ə": "e", "ă": "a", "ɛ": "e", "ɐ": "a",
  "š": "sh", "ž": "zh", "ḥ": "h", "ḍ": "d", "ṭ": "t", "ṣ": "s", "ẓ": "z", "ṛ": "r", "ḫ": "kh",
};

/** Tifinagh → latin, pour qu'une vedette écrite en tifinagh donne aussi un slug lisible. */
const TIFINAGH = {
  "ⴰ": "a", "ⴱ": "b", "ⴳ": "g", "ⴷ": "d", "ⴹ": "d", "ⴻ": "e", "ⴼ": "f", "ⴽ": "k",
  "ⵀ": "h", "ⵃ": "h", "ⵄ": "a", "ⵅ": "kh", "ⵇ": "q", "ⵉ": "i", "ⵊ": "j", "ⵍ": "l",
  "ⵎ": "m", "ⵏ": "n", "ⵓ": "u", "ⵔ": "r", "ⵕ": "r", "ⵖ": "gh", "ⵙ": "s", "ⵚ": "s",
  "ⵛ": "sh", "ⵜ": "t", "ⵟ": "t", "ⵡ": "w", "ⵢ": "y", "ⵣ": "z", "ⵥ": "z", "ⵯ": "",
};

/**
 * Slug lisible et stable pour une forme vedette.
 * « eɣlan » → « eghlan », « aḍu » → « adu », « əgməy » → « egmey », « ⴰⵎⴰⵏ » → « aman ».
 */
export function slugify(headword) {
  let s = String(headword || "").trim().toLowerCase();

  let out = "";
  for (const ch of s) {
    if (TIFINAGH[ch] !== undefined) out += TIFINAGH[ch];
    else if (MAP[ch] !== undefined) out += MAP[ch];
    else out += ch;
  }

  // Décompose les diacritiques restants (é, ù, ḍ non couverts au-dessus…) puis les retire.
  out = out.normalize("NFD").replace(/[̀-ͯ]/g, "");
  out = out.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return out || "entree";
}

/**
 * Rend un slug unique parmi ceux déjà pris. Le suffixe est numérique et déterministe
 * pour un même ordre d'insertion — un ré-amorçage reproduit donc les mêmes URL.
 */
export function uniqueSlug(base, taken) {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
