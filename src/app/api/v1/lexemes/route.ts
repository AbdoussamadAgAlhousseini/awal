import { db } from "@/lib/db";
import { searchLexemes } from "@/lib/search";
import { LEXEME_INCLUDE, lexemeToJSON, type LexemeWithRelations } from "@/lib/api/serialize";
import { json, preflight, requestOrigin, pagination } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

/**
 * GET /api/v1/lexemes
 * Liste paginée, ou recherche si `q` est fourni (réutilise le moteur à trois niveaux).
 * Query : q, limit (≤100), offset.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = requestOrigin(request);
  const q = (url.searchParams.get("q") ?? "").trim();
  const { limit, offset } = pagination(url);

  if (q) {
    const { hits, approximate } = await searchLexemes(q, offset + limit);
    const page = hits.slice(offset, offset + limit);
    const full = (await db.lexeme.findMany({
      where: { slug: { in: page.map((h) => h.slug) } },
      include: LEXEME_INCLUDE,
    })) as LexemeWithRelations[];
    // Conserver l'ordre de pertinence de la recherche.
    const bySlug = new Map(full.map((l) => [l.slug, l]));
    const data = page.map((h) => bySlug.get(h.slug)).filter(Boolean).map((l) => lexemeToJSON(l as LexemeWithRelations));

    return json({
      version: "v1",
      query: q,
      approximate,
      count: hits.length,
      limit,
      offset,
      data,
    });
  }

  const [total, rows] = await Promise.all([
    db.lexeme.count(),
    db.lexeme.findMany({
      orderBy: { headword: "asc" },
      skip: offset,
      take: limit,
      include: LEXEME_INCLUDE,
    }) as Promise<LexemeWithRelations[]>,
  ]);

  const next = offset + limit < total ? `${origin}/api/v1/lexemes?limit=${limit}&offset=${offset + limit}` : null;

  return json({
    version: "v1",
    count: total,
    limit,
    offset,
    next,
    data: rows.map(lexemeToJSON),
  });
}
