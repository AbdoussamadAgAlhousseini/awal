import { db } from "@/lib/db";
import { LEXEME_INCLUDE, type LexemeWithRelations } from "@/lib/api/serialize";
import { lexiconDocument } from "@/lib/api/jsonld";
import { CORS, preflight, requestOrigin } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

/**
 * GET /api/v1/lexicon.jsonld
 * Le lexique entier comme jeu de données Linked Data (Ontolex `Lexicon`), pour
 * moissonnage et chargement dans un triplestore (§22). CC BY-SA.
 */
export async function GET(request: Request) {
  const origin = requestOrigin(request);
  const rows = (await db.lexeme.findMany({
    orderBy: { headword: "asc" },
    include: LEXEME_INCLUDE,
  })) as LexemeWithRelations[];

  const doc = lexiconDocument(rows, origin);

  return Response.json(doc, {
    headers: {
      ...CORS,
      "Content-Type": "application/ld+json",
      "Content-Disposition": 'inline; filename="awal-lexicon.jsonld"',
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
