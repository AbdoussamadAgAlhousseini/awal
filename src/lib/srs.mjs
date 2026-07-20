// Awal — répétition espacée (§17).
//
// CHOIX D'ALGORITHME ET ÉCART ASSUMÉ AU DOSSIER
// Le dossier de conception mentionnait « un algorithme type FSRS ». FSRS repose sur un
// modèle de mémoire dont les paramètres s'ajustent sur un historique de révisions réel ;
// sans ces données, une implémentation approximative serait moins fiable qu'un SM-2
// correctement appliqué. On implémente donc **SM-2**, bien documenté et éprouvé, et le
// passage à FSRS reste une évolution possible une fois un historique constitué.

/** Notes possibles, du plus mauvais rappel au plus facile. */
export const RATINGS = ["again", "hard", "good", "easy"];

/** Correspondance note → « qualité » SM-2 (0–5). */
const QUALITY = { again: 2, hard: 3, good: 4, easy: 5 };

export const MIN_EASE = 1.3;
export const DEFAULT_EASE = 2.5;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Calcule le prochain état d'une carte.
 *
 * @param {{interval:number, ease:number, reps:number, lapses:number}} card état courant
 * @param {"again"|"hard"|"good"|"easy"} rating note donnée par l'apprenant
 * @param {Date} [now]
 * @returns {{interval:number, ease:number, reps:number, lapses:number, due:Date}}
 */
export function schedule(card, rating, now = new Date()) {
  const q = QUALITY[rating];
  if (q === undefined) throw new Error(`Note inconnue : ${rating}`);

  let { interval = 0, ease = DEFAULT_EASE, reps = 0, lapses = 0 } = card ?? {};

  // Ajustement du facteur de facilité (formule SM-2), borné par le bas.
  ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease < MIN_EASE) ease = MIN_EASE;

  if (rating === "again") {
    // Échec : la carte repasse en apprentissage et revient dans la même session.
    reps = 0;
    lapses += 1;
    interval = 0;
    return { interval, ease, reps, lapses, due: new Date(now.getTime() + 10 * 60 * 1000) };
  }

  reps += 1;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = 6;
  else interval = Math.round(interval * ease);

  // « hard » freine la progression, « easy » l'accélère.
  if (rating === "hard") interval = Math.max(1, Math.round(interval * 0.8));
  if (rating === "easy") interval = Math.round(interval * 1.3);

  return { interval, ease, reps, lapses, due: new Date(now.getTime() + interval * DAY_MS) };
}

/** Libellé de l'échéance suivante, pour afficher l'effet de chaque bouton. */
export function previewInterval(card, rating, now = new Date()) {
  const next = schedule(card, rating, now);
  if (next.interval === 0) return { minutes: 10, days: 0 };
  return { minutes: 0, days: next.interval };
}

/** Deux sens d'étude : reconnaissance et production. */
export const DIRECTIONS = ["t2l", "l2t"];
