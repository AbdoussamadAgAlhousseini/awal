import Link from "next/link";
import { submitContribution } from "@/app/actions";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

type SP = { kind?: string; lexeme?: string; e?: string };
const KINDS = ["new_lexeme", "example", "variant"] as const;

export default async function Contribute({ searchParams }: { searchParams: Promise<SP> }) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const sp = await searchParams;
  const kind = (KINDS as readonly string[]).includes(sp.kind ?? "") ? sp.kind! : "new_lexeme";
  const user = await getCurrentUser();

  const areas = await db.area.findMany({ orderBy: { country: "asc" } });
  const lexeme = sp.lexeme
    ? await db.lexeme.findUnique({
        where: { id: sp.lexeme },
        include: { senses: { orderBy: { order: "asc" } } },
      })
    : null;

  const qs = (k: string) => `/contribuer?kind=${k}${lexeme ? `&lexeme=${lexeme.id}` : ""}`;
  const needsEntry = (kind === "example" || kind === "variant") && !lexeme;

  return (
    <>
      <SiteHeader locale={locale} next={`/contribuer?kind=${kind}`} />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.contrib.title}</h2>
          <p className="muted">{t.contrib.intro}</p>

          {sp.e && <div className="flash err">{t.contrib.required}</div>}

          {!user ? (
            <div className="flash warn">
              {t.contrib.mustSignIn} <Link href="/compte">→ {t.nav.account}</Link>
            </div>
          ) : (
            <>
              <div className="tabs" role="tablist">
                {KINDS.map((k) => (
                  <Link key={k} href={qs(k)} className={`tab ${kind === k ? "on" : ""}`}>
                    {k === "new_lexeme" ? t.contrib.kindNew : k === "example" ? t.contrib.kindExample : t.contrib.kindVariant}
                  </Link>
                ))}
              </div>

              {lexeme && (
                <p className="ctx">
                  {t.contrib.forEntry} : <span className="tif gold">{lexeme.tifinagh}</span>{" "}
                  <b>{lexeme.headword}</b>
                </p>
              )}

              {needsEntry ? (
                <div className="flash warn">
                  {t.contrib.forEntry} — <Link href="/">{t.searchBtn}</Link>
                </div>
              ) : (
                <form action={submitContribution} className="form">
                  <input type="hidden" name="kind" value={kind} />
                  <input type="hidden" name="lexemeId" value={lexeme?.id ?? ""} />

                  {kind === "new_lexeme" && (
                    <>
                      <div className="grid2">
                        <label className="field-row">
                          <span>{t.contrib.headword} *</span>
                          <input name="headword" required maxLength={80} dir="ltr" />
                        </label>
                        <label className="field-row">
                          <span>{t.contrib.tifinagh}</span>
                          <input name="tifinagh" maxLength={80} className="tif" dir="ltr" />
                        </label>
                        <label className="field-row">
                          <span>{t.contrib.ipa}</span>
                          <input name="ipa" maxLength={80} dir="ltr" placeholder="/aˈman/" />
                        </label>
                        <label className="field-row">
                          <span>{t.contrib.pos}</span>
                          <select name="pos" defaultValue="nom">
                            <option value="nom">nom</option>
                            <option value="verbe">verbe</option>
                            <option value="adjectif">adjectif</option>
                            <option value="adverbe">adverbe</option>
                            <option value="pronom">pronom</option>
                          </select>
                        </label>
                      </div>
                      <label className="field-row">
                        <span>{t.contrib.definition} *</span>
                        <input name="defShort" required maxLength={200} dir="auto" />
                      </label>
                      <div className="grid2">
                        <label className="field-row">
                          <span>{t.contrib.trFr}</span>
                          <input name="trFr" maxLength={120} dir="auto" />
                        </label>
                        <label className="field-row">
                          <span>{t.contrib.trEn}</span>
                          <input name="trEn" maxLength={120} dir="auto" />
                        </label>
                        <label className="field-row">
                          <span>{t.contrib.trAr}</span>
                          <input name="trAr" maxLength={120} dir="auto" />
                        </label>
                        <label className="field-row">
                          <span>{t.contrib.area}</span>
                          <select name="areaId" defaultValue="">
                            <option value="">—</option>
                            {areas.map((a) => (
                              <option key={a.id} value={a.id}>{a.country} ({a.code})</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </>
                  )}

                  {kind === "example" && lexeme && (
                    <>
                      <label className="field-row">
                        <span>{t.contrib.sense}</span>
                        <select name="senseId" defaultValue={lexeme.senses[0]?.id}>
                          {lexeme.senses.map((s) => (
                            <option key={s.id} value={s.id}>{s.order}. {s.defShort}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field-row">
                        <span>{t.contrib.exampleText} *</span>
                        <input name="text" required maxLength={300} dir="ltr" />
                      </label>
                      <label className="field-row">
                        <span>{t.contrib.exampleTr}</span>
                        <input name="translation" maxLength={300} dir="auto" />
                      </label>
                    </>
                  )}

                  {kind === "variant" && lexeme && (
                    <div className="grid2">
                      <label className="field-row">
                        <span>{t.contrib.area} *</span>
                        <select name="areaId" required defaultValue="">
                          <option value="">—</option>
                          {areas.map((a) => (
                            <option key={a.id} value={a.id}>{a.country} ({a.code})</option>
                          ))}
                        </select>
                      </label>
                      <label className="field-row">
                        <span>{t.contrib.variantForm} *</span>
                        <input name="form" required maxLength={80} dir="ltr" />
                      </label>
                      <label className="field-row">
                        <span>{t.contrib.ipa}</span>
                        <input name="ipa" maxLength={80} dir="ltr" />
                      </label>
                    </div>
                  )}

                  <label className="field-row">
                    <span>{t.contrib.note}</span>
                    <input name="note" maxLength={300} dir="auto" />
                  </label>

                  <button type="submit" className="btn primary">{t.contrib.submit}</button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
