import Link from "next/link";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const KINDS = ["livre", "article", "manuscrit", "audio", "video", "archive"];

function rightsLabel(t: (typeof messages)[Locale], rights: string) {
  if (rights === "open") return t.lib.open;
  if (rights === "restricted") return t.lib.restricted;
  return t.lib.unknown;
}

export default async function Library({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const { kind } = await searchParams;
  const active = kind && KINDS.includes(kind) ? kind : null;

  const documents = await db.document.findMany({
    where: active ? { kind: active } : {},
    orderBy: [{ kind: "asc" }, { title: "asc" }],
  });

  const counts = await db.document.groupBy({ by: ["kind"], _count: { _all: true } });
  const countBy = new Map(counts.map((c) => [c.kind, c._count._all]));

  return (
    <>
      <SiteHeader locale={locale} next="/bibliotheque" />
      <div className="wrap">
        <section className="panel-section atlas-section">
          <h2 className="ptitle">{t.lib.title}</h2>
          <p className="muted">{t.lib.intro}</p>

          <div className="flash warn">{t.lib.noViewer}</div>

          <div className="tabs">
            <Link href="/bibliotheque" className={`tab ${!active ? "on" : ""}`}>
              {t.lib.all}
            </Link>
            {KINDS.filter((k) => countBy.get(k)).map((k) => (
              <Link key={k} href={`/bibliotheque?kind=${k}`} className={`tab ${active === k ? "on" : ""}`}>
                {t.lib.kinds[k]} <span className="tabn">{countBy.get(k)}</span>
              </Link>
            ))}
          </div>

          {documents.length === 0 ? (
            <div className="flash warn">{t.lib.empty}</div>
          ) : (
            <div className="doc-list">
              {documents.map((d) => (
                <article key={d.id} className="doc-card">
                  <header className="doc-head">
                    <span className="ckind">{t.lib.kinds[d.kind] ?? d.kind}</span>
                    <span className={`badge ${d.rights === "open" ? "approved" : d.rights === "restricted" ? "pending" : "rejected"}`}>
                      {rightsLabel(t, d.rights)}
                    </span>
                  </header>
                  <h3>
                    <Link href={`/bibliotheque/${d.id}`}>{d.title}</Link>
                  </h3>
                  <p className="doc-by muted small">
                    {[d.author, d.year, d.language].filter(Boolean).join(" · ")}
                  </p>
                  {d.description && (
                    <p className="doc-desc" dir="auto">{d.description}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
