import { cookies } from "next/headers";
import { db } from "./db";

export const USER_COOKIE = "awal_user";

export type SessionUser = {
  id: string;
  pseudonym: string;
  role: string;
  reputation: number;
};

/** Utilisateur courant, ou null. Identité pseudonyme (prototype — cf. §25 pour la v1.0). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const id = store.get(USER_COOKIE)?.value;
  if (!id) return null;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, pseudonym: true, role: true, reputation: true },
  });
  return user ?? null;
}

export function isModerator(user: SessionUser | null): boolean {
  return user?.role === "moderator";
}
