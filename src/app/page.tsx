import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale } from "@/lib/locale";
import { messages, posLabel, type Locale } from "@/lib/i18n";
import { searchLexemes } from "@/lib/search";
import { logSearch } from "@/lib/searchlog";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

type SP = { q?: string };

const SUGGESTIONS = [
  { hw: "aman", tif: "ⴰⵎⴰⵏ" },
  { hw: "akal", tif: "ⴰⴽⴰⵍ" },
  { hw: "tafukt", tif: "ⵜⴰⴼⵓⴽⵜ" },
  { hw: "awal", tif: "ⴰⵡⴰⵍ" },
  { hw: "afus", tif: "ⴰⴼⵓⵙ" },
];

function glossFor(locale: Locale, defShort: string | null, translations: string | null): string {
  if (locale === "fr") return defShort ?? "";
  try {
    const tr = translations ? (JSON.parse(translations) as Record<string, string>) : {};
    return tr[locale] || defShort || "";
  } catch {
    return defShort ?? "";
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const locale = await getLocale();
  if (!locale) redirect("/bienvenue");

  const t = messages[locale];
  const { q = "" } = await searchParams;
  const { hits, approximate } = q.trim()
    ? await searchLexemes(q)
    : { hits: [], approximate: false };

  // Analytique anonyme et agrégée (§20, §25) : compteur par terme, sans identité.
  if (q.trim()) await logSearch(q, hits.length);

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
              dir="auto"
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
            <div className="rescount">{t.resultsFor(hits.length, q)}</div>

            {approximate && <div className="flash warn">{t.approximateHint}</div>}

            {hits.length === 0 ? (
              <div className="empty">
                {t.noResults(q)}
                <br />
                {t.noResultsHint}
                <div style={{ marginTop: 14 }}>
                  <Link href="/contribuer?kind=new_lexeme" className="btn">
                    {t.contrib.open}
                  </Link>
                </div>
              </div>
            ) : (
              hits.map((h) => (
                <Link key={h.id} className="res" href={`/mot/${h.slug}`}>
                  <div className="top">
                    <span className="hw-tif tif">{h.tifinagh}</span>
                    <span className="hw">{h.headword}</span>
                    {h.ipa && <span className="ipa" dir="ltr">{h.ipa}</span>}
                    <span className="pos">{posLabel(locale, h.pos)}</span>
                    {h.score < 70 && <span className="approx">≈</span>}
                  </div>
                  <p className="def" dir="auto">{glossFor(locale, h.defShort, h.translations)}</p>
                </Link>
              ))
            )}
          </section>
        )}
      </div>
    </>
  );
}
