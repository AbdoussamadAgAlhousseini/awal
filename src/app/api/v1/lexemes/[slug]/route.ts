import { db } from "@/lib/db";
import { refWhere } from "@/lib/lexeme-ref";
import { LEXEME_INCLUDE, lexemeToJSON, type LexemeWithRelations } from "@/lib/api/serialize";
import { lexemeDocument } from "@/lib/api/jsonld";
import { json, apiError, preflight, requestOrigin } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

/**
 * GET /api/v1/lexemes/{slug}
 * Une entrée. Négociation de format : `?format=jsonld` (ou Accept: application/ld+json)
 * renvoie du JSON-LD Ontolex ; sinon du JSON plat.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(request.url);
  const origin = requestOrigin(request);

  const lx = (await db.lexeme.findFirst({
    where: refWhere(slug),
    include: LEXEME_INCLUDE,
  })) as LexemeWithRelations | null;

  if (!lx) {
    return apiError(404, "not_found", `Aucune entrée pour « ${slug} ».`);
  }

  const wantsLd =
    url.searchParams.get("format") === "jsonld" ||
    (request.headers.get("accept") ?? "").includes("ld+json");

  if (wantsLd) {
    return json(lexemeDocument(lx, origin), {
      headers: { "Content-Type": "application/ld+json" },
    });
  }

  return json({ version: "v1", data: lexemeToJSON(lx) });
}
