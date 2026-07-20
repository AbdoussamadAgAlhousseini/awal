import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Résout une référence d'entrée (§8).
 *
 * L'identifiant public est le `slug`, stable et citable. On accepte aussi l'ancien
 * identifiant technique en repli, pour qu'un lien déjà partagé continue de fonctionner
 * plutôt que de renvoyer une 404.
 */
export function refWhere(ref: string): Prisma.LexemeWhereInput {
  return { OR: [{ slug: ref }, { id: ref }] };
}

/** Retrouve une entrée par slug ou par identifiant technique. */
export async function findLexemeByRef<T extends Prisma.LexemeInclude>(
  ref: string,
  include: T,
) {
  return db.lexeme.findFirst({ where: refWhere(ref), include });
}

/** URL publique d'une entrée. */
export function lexemeHref(lexeme: { slug: string | null; id: string }): string {
  return `/mot/${lexeme.slug || lexeme.id}`;
}
