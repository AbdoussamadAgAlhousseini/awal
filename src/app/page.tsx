import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, posLabel, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

type SP = { q?: string };

async function searchLexemes(q: string) {
  const term = q.trim();
  if (!term) return [];
  // Recherche tolérante : latin (headword / variantes), tifinagh, ou traduction.
  return db.lexeme.findMany({
    where: {
      OR: [
        { headword: { contains: term } },
        { tifinagh: { contains: term } },
        { variants: { some: { form: { contains: term } } } },
        { senses: { some: { OR: [{ defShort: { contains: term } }, { translations: { contains: term } }] } } },
      ],
    },
    include: { senses: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { headword: "asc" },
    take: 40,
  });
}

const SUGGESTIONS = [
  { hw: "aman", tif: "ⴰⵎⴰⵏ" },
  { hw: "akal", tif: "ⴰⴽⴰⵍ" },
  { hw: "tafukt", tif: "ⵜⴰⴼⵓⴽⵜ" },
  { hw: "awal", tif: "ⴰⵡⴰⵍ" },
  { hw: "afus", tif: "ⴰⴼⵓⵙ" },
];

function glossFor(locale: Locale, defShort: string, translations: string | null): string {
  if (locale === "fr") return defShort;
  try {
    const tr = translations ? (JSON.parse(translations) as Record<string, string>) : {};
    return tr[locale] || defShort;
  } catch {
    return defShort;
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const locale = await getLocale();
  if (!locale) redirect("/bienvenue");

  const t = messages[locale];
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchLexemes(q) : [];

  return (
    <>
      <SiteHeader locale={locale} next="/" />
      <div className="wrap">
        <section className="hero">
          <div className="kick">{t.tagline}</div>
          <h1>
            <span className="tif" style={{ color: "var(--gold)" }}>ⴰⵡⴰⵍ</span> Awal
          </h1>
          <p>{t.heroSub}</p>

          <form className="searchbox" action="/" method="get" role="search">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchAria}
              autoFocus
            />
            <button type="submit">{t.searchBtn}</button>
          </form>

          {!q.trim() && (
            <div className="chips" aria-label={t.suggestionsAria}>
              {SUGGESTIONS.map((s) => (
                <Link key={s.hw} className="chip" href={`/?q=${encodeURIComponent(s.hw)}`}>
                  <span className="tif">{s.tif}</span> {s.hw}
                </Link>
              ))}
            </div>
          )}
        </section>

        {q.trim() && (
          <section className="results">
            <div className="rescount">{t.resultsFor(results.length, q)}</div>
            {results.length === 0 ? (
              <div className="empty">
                {t.noResults(q)}
                <br />
                {t.noResultsHint}
              </div>
            ) : (
              results.map((lx) => {
                const s = lx.senses[0];
                return (
                  <Link key={lx.id} className="res" href={`/mot/${lx.id}`}>
                    <div className="top">
                      <span className="hw-tif tif">{lx.tifinagh}</span>
                      <span className="hw">{lx.headword}</span>
                      {lx.ipa && <span className="ipa" dir="ltr">{lx.ipa}</span>}
                      <span className="pos">{posLabel(locale, lx.pos)}</span>
                    </div>
                    {s && (
                      <p className="def" dir="auto">
                        {glossFor(locale, s.defShort, s.translations)}
                      </p>
                    )}
                  </Link>
                );
              })
            )}
          </section>
        )}
      </div>
    </>
  );
}
