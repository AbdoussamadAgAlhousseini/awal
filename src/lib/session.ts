import { cookies } from "next/headers";
import { db } from "./db";
import { auth, authConfigured } from "@/auth";

export const USER_COOKIE = "awal_user";

export type SessionUser = {
  id: string;
  pseudonym: string;
  role: string;
  reputation: number;
  /** « oauth » = identité vérifiée par un fournisseur ; « prototype » = pseudonyme sans preuve. */
  origin: "oauth" | "prototype";
};

/**
 * Utilisateur courant (§25).
 *
 * Deux voies, dans cet ordre :
 *  1. session Auth.js, dès qu'un fournisseur d'identité est configuré ;
 *  2. cookie pseudonyme du PROTOTYPE, uniquement si aucun fournisseur ne l'est.
 *
 * Le repli est volontairement désactivé quand l'authentification réelle est en place :
 * laisser les deux voies ouvertes en même temps reviendrait à conserver une porte
 * dérobée permettant d'usurper n'importe quel pseudonyme.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (authConfigured && auth) {
    const session = await auth();
    const id = (session?.user as { id?: string } | undefined)?.id;
    if (!id) return null;

    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, pseudonym: true, role: true, reputation: true },
    });
    return user ? { ...user, origin: "oauth" } : null;
  }

  const store = await cookies();
  const id = store.get(USER_COOKIE)?.value;
  if (!id) return null;

  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, pseudonym: true, role: true, reputation: true },
  });
  return user ? { ...user, origin: "prototype" } : null;
}

export function isModerator(user: SessionUser | null): boolean {
  return user?.role === "moderator";
}
