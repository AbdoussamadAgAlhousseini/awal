import { handlers, authConfigured } from "@/auth";

/**
 * Points d'entrée Auth.js. Tant qu'aucun fournisseur n'est configuré, on répond
 * explicitement 503 plutôt que de laisser une route à moitié montée : un échec
 * lisible vaut mieux qu'une erreur obscure au premier appel.
 */
const notConfigured = () =>
  Response.json(
    {
      error: "auth_not_configured",
      message:
        "Aucun fournisseur d'identité n'est configuré. Renseignez AUTH_SECRET et les identifiants d'un fournisseur dans .env.local (voir .env.example).",
    },
    { status: 503 },
  );

export const GET = authConfigured && handlers ? handlers.GET : notConfigured;
export const POST = authConfigured && handlers ? handlers.POST : notConfigured;
