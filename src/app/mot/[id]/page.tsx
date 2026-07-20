import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, posLabel, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

function parseTr(json: string | null): Record<string, string> {
  if (!json) return {};
  try {
    return JSON.parse(json) as Record<string, string>;
  } catch {
    return {};
  }
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Les liens profonds fonctionnent sans choix préalable : on retombe sur la langue par défaut.
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];

  const lx = await db.lexeme.findUnique({
    where: { id },
    include: {
      root: true,
      senses: { orderBy: { order: "asc" }, include: { examples: { include: { source: true } } } },
      variants: { include: { area: true } },
    },
  });

  if (!lx) notFound();

  return (
    <>
      <SiteHeader locale={locale} next={`/mot/${lx.id}`} />
      <div className="wrap">
        <article>
          <Link href="/" className="back">{t.back}</Link>

          <div className="entry">
            <div className="head">
              <span className="hw-tif tif">{lx.tifinagh}</span>
              <span className="hw">{lx.headword}</span>
              {lx.ipa && <span className="ipa" dir="ltr">{lx.ipa}</span>}
              <span className="pos">
                {posLabel(locale, lx.pos)}
                {lx.gender ? ` · ${lx.gender}` : ""}
                {lx.number ? ` · ${lx.number}` : ""}
              </span>
            </div>

            <div className="meta">
              {lx.root && (
                <span className="field">
                  <b>{t.root}</b> √{lx.root.radicals}
                </span>
              )}
              {lx.frequency && (
                <span className="field">
                  <b>{t.frequency}</b> {lx.frequency}
                </span>
              )}
              {lx.register && (
                <span className="field">
                  <b>{t.register}</b> {lx.register}
                </span>
              )}
              {lx.etymology && (
                <span className="field">
                  <b>{t.etymology}</b> <span dir="auto">{lx.etymology}</span>
                </span>
              )}
            </div>

            <div className="senses">
              {lx.senses.map((s) => {
                const tr = parseTr(s.translations);
                const primary = locale === "fr" ? s.defShort : tr[locale] || s.defShort;
                return (
                  <div key={s.id} className="sense">
                    <span className="no">{s.order}.</span>
                    <div className="ds" dir="auto">{primary}</div>
                    {s.defLong && <div className="dl" dir="auto">{s.defLong}</div>}
                    {Object.keys(tr).length > 0 && (
                      <div className="tr">
                        {tr.fr && (
                          <>
                            <b>fr</b> {tr.fr}
                            {"  "}
                          </>
                        )}
                        {tr.en && (
                          <>
                            · <b>en</b> {tr.en}
                            {"  "}
                          </>
                        )}
                        {tr.ar && (
                          <>
                            · <b>ar</b> {tr.ar}
                          </>
                        )}
                      </div>
                    )}
                    {s.examples.map((e) => (
                      <div key={e.id} className="ex" dir="auto">
                        <span className="t">{e.text}</span>
                        {e.translation && <span className="x" dir="auto"> — {e.translation}</span>}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {lx.variants.length > 0 && (
              <div className="variants">
                <h3>{t.variants}</h3>
                <table className="vtable">
                  <thead>
                    <tr>
                      <th>{t.area}</th>
                      <th>{t.form}</th>
                      <th>{t.pronunciation}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lx.variants.map((v) => (
                      <tr key={v.id}>
                        <td>
                          {v.area.country} <span style={{ color: "var(--ink-faint)" }}>({v.area.code})</span>
                        </td>
                        <td className="tif" style={{ color: "var(--gold)" }}>{v.form}</td>
                        <td style={{ fontFamily: "var(--mono)", color: "var(--silver)" }}>{v.ipa ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="entry-actions">
            <Link href={`/contribuer?kind=example&lexeme=${lx.id}`} className="btn">
              + {t.contrib.kindExample}
            </Link>
            <Link href={`/contribuer?kind=variant&lexeme=${lx.id}`} className="btn">
              + {t.contrib.kindVariant}
            </Link>
          </div>

          <div className="note">{t.entryNote}</div>
        </article>
      </div>
    </>
  );
}
