import Link from "next/link";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "histoire", "oralite", "musique", "artisanat",
  "pastoralisme", "habitat", "cosmologie", "coutume", "nature",
];

export default async function Encyclopedia({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const { cat } = await searchParams;
  const active = cat && CATEGORIES.includes(cat) ? cat : null;

  const articles = await db.article.findMany({
    where: { status: "published", ...(active ? { category: active } : {}) },
    orderBy: { title: "asc" },
    include: { area: true },
  });

  const counts = await db.article.groupBy({
    by: ["category"],
    where: { status: "published" },
    _count: { _all: true },
  });
  const countBy = new Map(counts.map((c) => [c.category, c._count._all]));

  return (
    <>
      <SiteHeader locale={locale} next="/encyclopedie" />
      <div className="wrap">
        <section className="panel-section atlas-section">
          <h2 className="ptitle">{t.enc.title}</h2>
          <p className="muted">{t.enc.intro}</p>

          <div className="tabs">
            <Link href="/encyclopedie" className={`tab ${!active ? "on" : ""}`}>
              {t.lib.all}
            </Link>
            {CATEGORIES.filter((c) => countBy.get(c)).map((c) => (
              <Link key={c} href={`/encyclopedie?cat=${c}`} className={`tab ${active === c ? "on" : ""}`}>
                {t.enc.categories[c]} <span className="tabn">{countBy.get(c)}</span>
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div className="flash warn">{t.enc.empty}</div>
          ) : (
            <div className="art-grid">
              {articles.map((a) => (
                <article key={a.id} className="art-card">
                  <header>
                    <span className="art-cat">{t.enc.categories[a.category] ?? a.category}</span>
                    {a.sensitivity === "restricted" && (
                      <span className="badge rejected">{t.enc.restrictedTitle}</span>
                    )}
                  </header>
                  <h3>
                    <Link href={`/encyclopedie/${a.slug}`}>{a.title}</Link>
                  </h3>
                  <p className="art-sum" dir="auto">{a.summary}</p>
                  <Link href={`/encyclopedie/${a.slug}`} className="art-more">
                    {t.enc.readMore} →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
