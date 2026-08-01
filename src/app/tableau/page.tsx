import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { messages, posLabel, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { computeStats } from "@/lib/stats";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

/** Barre de progression accessible. */
function Meter({ pct, tone = "gold" }: { pct: number; tone?: "gold" | "sky" }) {
  return (
    <div
      className={`meter ${tone}`}
      role="meter"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="meter-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default async function Dashboard() {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const d = t.dash;
  const s = await computeStats();

  const complLabels: Record<string, string> = {
    tifinagh: d.cTifinagh,
    ipa: d.cIpa,
    translation: d.cTranslation,
    example: d.cExample,
    audio: d.cAudio,
  };

  const maxPos = Math.max(1, ...s.byPos.map((p) => p.count));

  return (
    <>
      <SiteHeader locale={locale} next="/tableau" />
      <div className="wrap">
        <section className="panel-section dash">
          <h2 className="ptitle">{d.title}</h2>
          <p className="muted">{d.intro}</p>

          {/* ── Couverture ── */}
          <h3 className="sub-h">{d.coverage}</h3>
          <div className="stats">
            <div className="stat"><div className="v">{s.total}</div><div className="l">{d.totalEntries}</div></div>
            <div className="stat"><div className="v">{s.avgSenses}</div><div className="l">{d.avgSenses}</div></div>
            <div className="stat"><div className="v">{s.vitality.length}</div><div className="l">{t.admin.areas}</div></div>
          </div>

          <h4 className="dash-h4">{d.byCategory}</h4>
          <div className="barlist">
            {s.byPos.map((p) => (
              <div key={p.pos} className="barrow">
                <span className="barlabel">{posLabel(locale, p.pos)}</span>
                <div className="meter gold"><div className="meter-fill" style={{ width: `${(p.count / maxPos) * 100}%` }} /></div>
                <span className="barval">{p.count}</span>
              </div>
            ))}
          </div>

          {/* ── Complétude ── */}
          <h3 className="sub-h">{d.completeness}</h3>
          <p className="muted small">{d.completenessNote}</p>
          <div className="barlist">
            {s.completeness.map((c) => (
              <div key={c.key} className="barrow">
                <span className="barlabel">{complLabels[c.key] ?? c.key}</span>
                <Meter pct={c.pct} tone={c.key === "audio" ? "sky" : "gold"} />
                <span className="barval">{c.pct}%</span>
              </div>
            ))}
          </div>

          {/* ── Communauté ── */}
          <h3 className="sub-h">{d.community}</h3>
          <div className="stats">
            <div className="stat"><div className="v">{s.community.contributors}</div><div className="l">{d.contributors}</div></div>
            <div className="stat"><div className="v">{s.community.activeContributors}</div><div className="l">{d.activeContributors}</div></div>
            <div className="stat"><div className="v">{s.community.contributions.total}</div><div className="l">{d.contributions}</div></div>
            <div className="stat"><div className="v">{s.community.contributions.pending}</div><div className="l">{d.pending}</div></div>
            <div className="stat">
              <div className="v">{s.community.medianReviewH === null ? "—" : `${s.community.medianReviewH}${d.hours}`}</div>
              <div className="l">{d.medianReview}</div>
            </div>
          </div>
          <p className="muted small" style={{ marginTop: 8 }}>
            <span className="badge approved">{s.community.contributions.approved} {d.approved}</span>{" "}
            <span className="badge rejected">{s.community.contributions.rejected} {d.rejected}</span>
          </p>

          {/* ── Indice de couverture documentaire ── */}
          <h3 className="sub-h">{d.vitality}</h3>
          <div className="note" dir="auto">{d.vitalityNote}</div>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>{t.admin.areas}</th>
                  <th>{d.documented}</th>
                  <th>{d.coverageCol}</th>
                  <th>{d.audioCol}</th>
                  <th>{d.indexCol}</th>
                </tr>
              </thead>
              <tbody>
                {s.vitality.map((v) => (
                  <tr key={v.code}>
                    <td>{v.country} <span className="tag">{v.code}</span></td>
                    <td className="tabular">{v.documented}</td>
                    <td style={{ minWidth: 160 }}>
                      <div className="meter gold inline"><div className="meter-fill" style={{ width: `${v.coverage}%` }} /></div>
                      <span className="barval">{v.coverage}%</span>
                    </td>
                    <td className="tabular muted">{v.audio}%</td>
                    <td className="dash-index">{v.index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Usage (analytique anonyme et agrégée) ── */}
          <h3 className="sub-h">{d.usage}</h3>
          <p className="muted small" dir="auto">{d.usageIntro}</p>

          {s.usage.totalSearches === 0 ? (
            <div className="flash warn">{d.noSearches}</div>
          ) : (
            <>
              <div className="stats">
                <div className="stat"><div className="v">{s.usage.totalSearches}</div><div className="l">{d.totalSearches}</div></div>
                <div className="stat"><div className="v">{s.usage.distinctTerms}</div><div className="l">{d.distinctTerms}</div></div>
              </div>

              <div className="usage-cols">
                <div className="usage-col">
                  <h4 className="dash-h4">{d.topSearches}</h4>
                  <ul className="usage-list">
                    {s.usage.topTerms.map((r) => (
                      <li key={r.term}>
                        <span className="usage-term" dir="auto">{r.term}</span>
                        <span className="usage-count">{r.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {s.usage.topNoResult.length > 0 && (
                  <div className="usage-col">
                    <h4 className="dash-h4">{d.toAdd}</h4>
                    <ul className="usage-list">
                      {s.usage.topNoResult.map((r) => (
                        <li key={r.term}>
                          <a href={`/contribuer?kind=new_lexeme`} className="usage-term missing" dir="auto">{r.term}</a>
                          <span className="usage-count">{r.count}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="muted small" dir="auto">{d.toAddNote}</p>
                  </div>
                )}
              </div>
            </>
          )}

          <p style={{ marginTop: 24 }}>
            <Link href="/" className="back">← Awal</Link>
          </p>
        </section>
      </div>
    </>
  );
}
