import Link from "next/link";
import { reviewContribution } from "@/app/actions";
import { db } from "@/lib/db";
import { getCurrentUser, isModerator } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { parsePayload } from "@/lib/contributions";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const FIELD_ORDER = [
  "headword", "tifinagh", "ipa", "pos", "defShort",
  "trFr", "trEn", "trAr", "areaId", "variantForm",
  "senseId", "text", "translation", "form",
];

type Lookups = { areas: Map<string, string>; senses: Map<string, string> };

/**
 * Rend une proposition de façon lisible : libellés traduits et identifiants
 * internes résolus (un valideur ne doit pas avoir à décoder « ne » ou un cuid).
 */
function PayloadView({
  payload, labels, lookups,
}: { payload: string; labels: Record<string, string>; lookups: Lookups }) {
  const p = parsePayload(payload);
  const keys = FIELD_ORDER.filter((k) => p[k]).concat(
    Object.keys(p).filter((k) => p[k] && !FIELD_ORDER.includes(k)),
  );
  if (keys.length === 0) return null;

  const display = (k: string, v: string) => {
    if (k === "areaId") return lookups.areas.get(v) ?? v;
    if (k === "senseId") return lookups.senses.get(v) ?? v;
    return v;
  };

  return (
    <dl className="payload">
      {keys.map((k) => (
        <div key={k} className="prow">
          <dt>{labels[k] ?? k}</dt>
          <dd dir="auto">{display(k, p[k])}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function Moderation({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const { e } = await searchParams;
  const user = await getCurrentUser();

  if (!isModerator(user)) {
    return (
      <>
        <SiteHeader locale={locale} next="/moderation" />
        <div className="wrap">
          <section className="panel-section">
            <h2 className="ptitle">{t.mod.title}</h2>
            <div className="flash warn">
              {t.mod.denied} <Link href="/compte">→ {t.nav.account}</Link>
            </div>
          </section>
        </div>
      </>
    );
  }

  const pending = await db.contribution.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { pseudonym: true } }, lexeme: { select: { id: true, headword: true } } },
  });

  const recent = await db.contribution.findMany({
    where: { status: { in: ["approved", "rejected"] } },
    orderBy: { reviewedAt: "desc" },
    take: 10,
    include: { author: { select: { pseudonym: true } }, reviewer: { select: { pseudonym: true } } },
  });

  const kindLabel = (k: string) =>
    k === "new_lexeme" ? t.contrib.kindNew : k === "example" ? t.contrib.kindExample : t.contrib.kindVariant;

  // Libellés lisibles + résolution des identifiants internes présents dans les charges utiles.
  const labels: Record<string, string> = {
    headword: t.contrib.headword, tifinagh: t.contrib.tifinagh, ipa: t.contrib.ipa,
    pos: t.contrib.pos, defShort: t.contrib.definition,
    trFr: t.contrib.trFr, trEn: t.contrib.trEn, trAr: t.contrib.trAr,
    areaId: t.contrib.area, variantForm: t.contrib.variantForm, form: t.contrib.variantForm,
    senseId: t.contrib.sense, text: t.contrib.exampleText, translation: t.contrib.exampleTr,
  };

  const senseIds = pending
    .map((c) => parsePayload(c.payload).senseId)
    .filter((v): v is string => Boolean(v));

  const [areaRows, senseRows] = await Promise.all([
    db.area.findMany({ select: { id: true, country: true, code: true } }),
    senseIds.length
      ? db.sense.findMany({ where: { id: { in: senseIds } }, select: { id: true, order: true, defShort: true } })
      : Promise.resolve([]),
  ]);

  const lookups: Lookups = {
    areas: new Map(areaRows.map((a) => [a.id, `${a.country} (${a.code})`])),
    senses: new Map(senseRows.map((s) => [s.id, `${s.order}. ${s.defShort}`])),
  };

  return (
    <>
      <SiteHeader locale={locale} next="/moderation" />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.mod.title}</h2>
          <p className="muted">{t.mod.intro}</p>

          {e === "self" && <div className="flash err">{t.mod.selfReview}</div>}

          {pending.length === 0 ? (
            <div className="flash ok">{t.mod.empty}</div>
          ) : (
            <div className="queue">
              {pending.map((c) => (
                <article key={c.id} className="qcard">
                  <header className="qhead">
                    <span className="badge pending">{t.mod.pending}</span>
                    <span className="ckind">{kindLabel(c.kind)}</span>
                    <span className="muted small">
                      {t.mod.by} <b>{c.author.pseudonym}</b>
                      {c.lexeme && (
                        <>
                          {" · "}
                          <Link href={`/mot/${c.lexeme.id}`}>{c.lexeme.headword}</Link>
                        </>
                      )}
                    </span>
                  </header>

                  <PayloadView payload={c.payload} labels={labels} lookups={lookups} />
                  {c.note && <p className="qnote" dir="auto">« {c.note} »</p>}

                  <form action={reviewContribution.bind(null, "reject")} className="qactions">
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="reviewNote"
                      placeholder={t.mod.reviewNote}
                      maxLength={300}
                      dir="auto"
                      className="qinput"
                    />
                    <button
                      type="submit"
                      formAction={reviewContribution.bind(null, "approve")}
                      className="btn primary"
                    >
                      {t.mod.approve}
                    </button>
                    <button type="submit" className="btn danger">
                      {t.mod.reject}
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <>
              <h3 className="sub-h">{t.mod.history}</h3>
              <ul className="clist">
                {recent.map((c) => (
                  <li key={c.id} className="citem">
                    <span className={`badge ${c.status}`}>
                      {c.status === "approved" ? t.mod.approved : t.mod.rejected}
                    </span>
                    <span className="ckind">{kindLabel(c.kind)}</span>
                    <span className="muted small">
                      {t.mod.by} {c.author.pseudonym}
                      {c.reviewer && ` → ${c.reviewer.pseudonym}`}
                    </span>
                    {c.reviewNote && <span className="cnote" dir="auto">« {c.reviewNote} »</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}
