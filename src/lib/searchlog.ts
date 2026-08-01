import { db } from "@/lib/db";

/**
 * Analytique de recherche — AGRÉGÉE et ANONYME (§20, §25).
 *
 * On ne conserve qu'un compteur par terme normalisé : ni identifiant, ni IP, ni
 * horodatage par événement. Impossible de reconstituer le parcours d'une personne.
 * Objectif : mesurer ce qui est cherché, et surtout ce qui est cherché SANS résultat,
 * pour orienter la collecte lexicale.
 */

/** Normalisation pure : minuscules, espaces réduits, longueur bornée. */
export function normalizeSearchTerm(raw: string): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

/** Incrémente le compteur d'un terme. Ne doit jamais faire échouer la recherche. */
export async function logSearch(raw: string, resultCount: number): Promise<void> {
  const term = normalizeSearchTerm(raw);
  if (!term) return;
  try {
    await db.searchQuery.upsert({
      where: { term },
      update: { count: { increment: 1 }, lastResults: resultCount },
      create: { term, count: 1, lastResults: resultCount },
    });
  } catch {
    // L'analytique est secondaire : une erreur ici ne doit rien casser.
  }
}
