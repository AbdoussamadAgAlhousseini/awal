import { db } from "@/lib/db";
import { json, preflight } from "@/lib/api/http";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return preflight();
}

/**
 * GET /api/v1/areas
 * Les cinq aires dialectales, avec le nombre d'entrées documentées et le polygone
 * indicatif (GeoJSON). Voir l'avertissement de l'atlas : zones indicatives (§15).
 */
export async function GET() {
  const areas = await db.area.findMany({ orderBy: { country: "asc" } });
  const counts = await db.variant.groupBy({ by: ["areaId"], _count: { _all: true } });
  const countBy = new Map(counts.map((c) => [c.areaId, c._count._all]));

  return json({
    version: "v1",
    note: "Zones indicatives — ni isoglosses attestées ni limites territoriales.",
    data: areas.map((a) => ({
      code: a.code,
      country: a.country,
      name: a.name,
      entries: countBy.get(a.id) ?? 0,
      geometry: a.geojson ? JSON.parse(a.geojson) : null,
    })),
  });
}
