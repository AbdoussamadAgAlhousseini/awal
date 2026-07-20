import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/lexemes?q=aman&limit=20  — recherche publique (préfigure l'API v1 du §22)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? 20) || 20, 100);

  const where = q
    ? {
        OR: [
          { headword: { contains: q } },
          { tifinagh: { contains: q } },
          { variants: { some: { form: { contains: q } } } },
          { senses: { some: { translations: { contains: q } } } },
        ],
      }
    : {};

  const rows = await db.lexeme.findMany({
    where,
    include: {
      root: { select: { radicals: true } },
      senses: { orderBy: { order: "asc" }, select: { order: true, defShort: true, translations: true } },
      variants: { select: { form: true, ipa: true, area: { select: { code: true, country: true } } } },
    },
    orderBy: { headword: "asc" },
    take: limit,
  });

  const data = rows.map((lx) => ({
    id: lx.id,
    slug: lx.slug,
    headword: lx.headword,
    tifinagh: lx.tifinagh,
    ipa: lx.ipa,
    pos: lx.pos,
    root: lx.root?.radicals ?? null,
    senses: lx.senses.map((s) => ({
      order: s.order,
      definition: s.defShort,
      translations: s.translations ? JSON.parse(s.translations) : {},
    })),
    variants: lx.variants.map((v) => ({ area: v.area.code, country: v.area.country, form: v.form, ipa: v.ipa })),
  }));

  return NextResponse.json(
    { version: "v0", query: q, count: data.length, data },
    { headers: { "Cache-Control": "public, max-age=30" } },
  );
}
