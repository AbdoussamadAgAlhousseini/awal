// Awal — utilitaires HTTP de l'API publique (§22, §25).

/** En-têtes CORS : lecture publique, ouverte à tous les domaines. */
export const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type JsonInit = { status?: number; headers?: Record<string, string> };

/** Réponse JSON avec CORS et cache court par défaut. */
export function json(data: unknown, init: JsonInit = {}) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: {
      ...CORS,
      "Cache-Control": "public, max-age=60, s-maxage=300",
      ...init.headers,
    },
  });
}

/** Réponse d'erreur normalisée. */
export function apiError(status: number, code: string, message: string) {
  return json({ error: code, message }, { status });
}

/** Réponse au préambule CORS. */
export function preflight() {
  return new Response(null, { status: 204, headers: CORS });
}

/** Origine absolue de la requête (respecte les en-têtes de proxy). */
export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  return `${proto}://${host}`;
}

/** Lit et borne les paramètres de pagination. */
export function pagination(url: URL, defaultLimit = 20, maxLimit = 100) {
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || defaultLimit, 1), maxLimit);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);
  return { limit, offset };
}
