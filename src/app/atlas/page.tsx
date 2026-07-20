import Link from "next/link";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { AREA_SHAPES, LANDMARKS, VIEW, project, ringToPath, ringCentroid } from "@/lib/geo.mjs";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

type SP = { terme?: string };

export default async function Atlas({ searchParams }: { searchParams: Promise<SP> }) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const { terme } = await searchParams;

  const areas = await db.area.findMany({ orderBy: { country: "asc" } });

  // Nombre d'entrées documentées par aire (via les variantes).
  const counts = await db.variant.groupBy({ by: ["areaId"], _count: { _all: true } });
  const countBy = new Map(counts.map((c) => [c.areaId, c._count._all]));

  // Mode « répartition d'un terme » : quelles aires attestent ce mot, sous quelle forme ?
  const lexeme = terme
    ? await db.lexeme.findUnique({
        where: { id: terme },
        include: { variants: { include: { area: true } } },
      })
    : null;
  const formBy = new Map(lexeme?.variants.map((v) => [v.areaId, v.form]) ?? []);

  const shapeKeys = Object.keys(AREA_SHAPES) as (keyof typeof AREA_SHAPES)[];

  return (
    <>
      <SiteHeader locale={locale} next="/atlas" />
      <div className="wrap">
        <section className="panel-section atlas-section">
          <h2 className="ptitle">{t.atlas.title}</h2>
          <p className="muted">
            {lexeme ? (
              <>
                {t.atlas.distributionOf} <span className="tif gold">{lexeme.tifinagh}</span>{" "}
                <b>{lexeme.headword}</b> — <Link href="/atlas">{t.atlas.allAreas}</Link>
              </>
            ) : (
              t.atlas.intro
            )}
          </p>

          <figure className="atlas-fig">
            <svg
              viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
              className="atlas-svg"
              role="img"
              aria-label={t.atlas.title}
            >
              {/* Repères de latitude/longitude, pour situer sans fond de carte externe */}
              <g className="grat">
                {[15, 20, 25].map((lat) => {
                  const [, y] = project([0, lat]);
                  return (
                    <g key={lat}>
                      <line x1="0" y1={y} x2={VIEW.w} y2={y} />
                      <text x="6" y={y - 5}>{lat}°N</text>
                    </g>
                  );
                })}
                {[0, 5, 10].map((lon) => {
                  const [x] = project([lon, 0]);
                  return (
                    <g key={lon}>
                      <line x1={x} y1="0" x2={x} y2={VIEW.h} />
                      <text x={x + 5} y={VIEW.h - 8}>{lon}°E</text>
                    </g>
                  );
                })}
              </g>

              {/* Aires dialectales */}
              {shapeKeys.map((code) => {
                const shape = AREA_SHAPES[code] as { label: string; labelAt?: [number, number]; ring: [number, number][] };
                const [cx, cy] = shape.labelAt ? project(shape.labelAt) : ringCentroid(shape.ring);
                const has = formBy.has(code as string);
                const cls = lexeme ? (has ? "area has" : "area hasnt") : "area";
                return (
                  <g key={code} className={cls}>
                    <path d={ringToPath(shape.ring)} />
                    <text x={cx} y={cy} className="area-label">
                      {shape.label}
                    </text>
                    {lexeme && has && (
                      <text x={cx} y={cy + 16} className="area-form">
                        {formBy.get(code as string)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Repères géographiques */}
              <g className="marks">
                {(LANDMARKS as { name: string; at: [number, number] }[]).map((m) => {
                  const [x, y] = project(m.at);
                  return (
                    <g key={m.name}>
                      <circle cx={x} cy={y} r="3" />
                      <text x={x + 7} y={y + 4}>{m.name}</text>
                    </g>
                  );
                })}
              </g>
            </svg>

            <figcaption className="atlas-caption">{t.atlas.indicative}</figcaption>
          </figure>

          {lexeme && (
            <div className="atlas-legend">
              <span><i className="sw has" /> {t.atlas.present}</span>
              <span><i className="sw hasnt" /> {t.atlas.absent}</span>
            </div>
          )}

          <div className="area-cards">
            {areas.map((a) => {
              const form = formBy.get(a.id);
              return (
                <article key={a.id} className="area-card">
                  <header>
                    <span className="area-code">{a.code}</span>
                    <h4>{a.country}</h4>
                  </header>
                  <p className="muted small">{a.name}</p>
                  <p className="area-stat">
                    <b>{countBy.get(a.id) ?? 0}</b> {t.atlas.entries}
                  </p>
                  {lexeme && (
                    <p className={`area-form-line ${form ? "" : "none"}`} dir="ltr">
                      {form ? `${t.atlas.variantHere} : ${form}` : t.atlas.noVariant}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
