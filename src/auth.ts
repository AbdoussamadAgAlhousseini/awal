import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";

/**
 * Authentification (§25).
 *
 * ÉTAT : câblage complet, EN ATTENTE D'IDENTIFIANTS.
 *
 * Aucun fournisseur n'est activé tant que ses variables d'environnement ne sont pas
 * renseignées. Dans ce cas la plateforme retombe sur l'identité pseudonyme du
 * prototype — laquelle n'authentifie personne et ne doit pas être mise en ligne.
 * Voir .env.example.
 *
 * Rien ici ne contient de secret : les valeurs viennent exclusivement de
 * l'environnement, et .env* est exclu du dépôt.
 */

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

/** Fournisseurs réellement configurés — la liste est vide par défaut. */
function buildProviders() {
  const providers = [];

  const ghId = env("AUTH_GITHUB_ID");
  const ghSecret = env("AUTH_GITHUB_SECRET");
  if (ghId && ghSecret) providers.push(GitHub({ clientId: ghId, clientSecret: ghSecret }));

  const gId = env("AUTH_GOOGLE_ID");
  const gSecret = env("AUTH_GOOGLE_SECRET");
  if (gId && gSecret) providers.push(Google({ clientId: gId, clientSecret: gSecret }));

  return providers;
}

export const providers = buildProviders();

/** Noms des fournisseurs actifs, pour l'interface. */
export const enabledProviders: { id: string; label: string }[] = [
  ...(env("AUTH_GITHUB_ID") && env("AUTH_GITHUB_SECRET") ? [{ id: "github", label: "GitHub" }] : []),
  ...(env("AUTH_GOOGLE_ID") && env("AUTH_GOOGLE_SECRET") ? [{ id: "google", label: "Google" }] : []),
];

/**
 * L'authentification réelle n'est active que si un fournisseur ET un secret de
 * session sont présents. Sans cela, on ne monte pas Auth.js du tout : mieux vaut
 * un mode prototype clairement signalé qu'une authentification à moitié branchée.
 */
export const authConfigured = providers.length > 0 && Boolean(env("AUTH_SECRET"));

/**
 * Adresses autorisées à valider les contributions.
 *
 * Remplace le « code de modération » du prototype : un code partagé se transmet et
 * ne prouve rien sur l'identité de qui l'emploie. Une liste d'adresses vérifiées
 * par le fournisseur d'identité, elle, est nominative.
 */
export function moderatorEmails(): string[] {
  return (env("AWAL_MODERATOR_EMAILS") ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isModeratorEmail(email?: string | null): boolean {
  if (!email) return false;
  return moderatorEmails().includes(email.toLowerCase());
}

/** Dérive un pseudonyme public unique et lisible depuis le profil du fournisseur. */
async function derivePseudonym(seed: string): Promise<string> {
  const base = (seed || "contributeur").split("@")[0].replace(/[^\p{L}\p{N}_-]/gu, "").slice(0, 32) || "contributeur";
  let candidate = base;
  for (let n = 2; await db.user.findUnique({ where: { pseudonym: candidate } }); n++) {
    candidate = `${base}-${n}`;
  }
  return candidate;
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers,
  session: { strategy: "database" },
  pages: { signIn: "/compte" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const row = await db.user.findUnique({
          where: { id: user.id },
          select: { pseudonym: true, role: true, reputation: true },
        });
        Object.assign(session.user, {
          id: user.id,
          pseudonym: row?.pseudonym ?? null,
          role: row?.role ?? "contributor",
          reputation: row?.reputation ?? 0,
        });
      }
      return session;
    },
  },
  events: {
    /**
     * À la création d'un compte : attribuer un pseudonyme public et, le cas échéant,
     * le rôle de valideur selon la liste d'adresses autorisées.
     */
    async createUser({ user }) {
      const pseudonym = await derivePseudonym(user.name || user.email || "");
      await db.user.update({
        where: { id: user.id },
        data: {
          pseudonym,
          role: isModeratorEmail(user.email) ? "moderator" : "contributor",
        },
      });
    },
    /** Le rôle est réévalué à chaque connexion : retirer une adresse retire le droit. */
    async signIn({ user }) {
      if (!user?.id) return;
      const current = await db.user.findUnique({ where: { id: user.id }, select: { role: true, email: true } });
      const expected = isModeratorEmail(current?.email) ? "moderator" : "contributor";
      if (current && current.role !== expected) {
        await db.user.update({ where: { id: user.id }, data: { role: expected } });
      }
    },
  },
};

// NextAuth n'est instancié que si la configuration est complète.
const nextAuth = authConfigured ? NextAuth(authConfig) : null;

export const handlers = nextAuth?.handlers ?? null;
export const signIn = nextAuth?.signIn ?? null;
export const signOut = nextAuth?.signOut ?? null;
export const auth = nextAuth?.auth ?? null;
