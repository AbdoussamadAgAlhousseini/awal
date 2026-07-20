import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { reviewCard, removeFromDeck } from "@/app/actions";
import { previewInterval, RATINGS } from "@/lib/srs.mjs";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

function gloss(locale: Locale, defShort: string, translations: string | null): string {
  if (locale === "fr") return defShort;
  try {
    const tr = translations ? (JSON.parse(translations) as Record<string, string>) : {};
    return tr[locale] || defShort;
  } catch {
    return defShort;
  }
}

export default async function Learn({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];
  const { show } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <SiteHeader locale={locale} next="/apprendre" />
        <div className="wrap">
          <section className="panel-section">
            <h2 className="ptitle">{t.learn.title}</h2>
            <div className="flash warn">
              {t.learn.signIn} <Link href="/compte">→ {t.nav.account}</Link>
            </div>
          </section>
        </div>
      </>
    );
  }

  const now = new Date();
  const total = await db.card.count({ where: { userId: user.id } });
  const dueCount = await db.card.count({ where: { userId: user.id, due: { lte: now } } });

  const card = await db.card.findFirst({
    where: { userId: user.id, due: { lte: now } },
    orderBy: { due: "asc" },
    include: {
      lexeme: { include: { senses: { take: 1, orderBy: { order: "asc" } } } },
    },
  });

  const revealed = show === "1";

  return (
    <>
      <SiteHeader locale={locale} next="/apprendre" />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.learn.title}</h2>
          <p className="muted">{t.learn.intro}</p>

          <div className="learn-stats">
            <span><b>{dueCount}</b> {t.learn.due}</span>
            <span><b>{total}</b> {t.learn.total}</span>
          </div>

          {total === 0 ? (
            <div className="flash warn">{t.learn.noCards}</div>
          ) : !card ? (
            <div className="learn-done">
              <h3>{t.learn.doneTitle}</h3>
              <p className="muted">{t.learn.doneBody}</p>
            </div>
          ) : (
            <article className="review">
              <div className="review-dir">
                {card.direction === "t2l" ? t.learn.recognition : t.learn.production}
              </div>

              <div className="review-prompt">
                {card.direction === "t2l" ? (
                  <>
                    <div className="rp-tif tif">{card.lexeme.tifinagh}</div>
                    <div className="rp-hw">{card.lexeme.headword}</div>
                  </>
                ) : (
                  <div className="rp-gloss" dir="auto">
                    {gloss(locale, card.lexeme.senses[0]?.defShort ?? "", card.lexeme.senses[0]?.translations ?? null)}
                  </div>
                )}
              </div>

              {!revealed ? (
                <Link href="/apprendre?show=1" className="btn primary review-reveal">
                  {t.learn.reveal}
                </Link>
              ) : (
                <>
                  <div className="review-answer">
                    {card.direction === "t2l" ? (
                      <div className="rp-gloss" dir="auto">
                        {gloss(locale, card.lexeme.senses[0]?.defShort ?? "", card.lexeme.senses[0]?.translations ?? null)}
                      </div>
                    ) : (
                      <>
                        <div className="rp-tif tif">{card.lexeme.tifinagh}</div>
                        <div className="rp-hw">{card.lexeme.headword}</div>
                      </>
                    )}
                    {card.lexeme.ipa && <div className="rp-ipa" dir="ltr">{card.lexeme.ipa}</div>}
                    <Link href={`/mot/${card.lexeme.slug || card.lexeme.id}`} className="rp-link">
                      {t.enc.readMore} →
                    </Link>
                  </div>

                  <div className="review-actions">
                    {(RATINGS as string[]).map((r) => {
                      const p = previewInterval(
                        { interval: card.interval, ease: card.ease, reps: card.reps, lapses: card.lapses },
                        r,
                      );
                      const label = { again: t.learn.again, hard: t.learn.hard, good: t.learn.good, easy: t.learn.easy }[r as "again"];
                      return (
                        <form key={r} action={reviewCard.bind(null, r)}>
                          <input type="hidden" name="cardId" value={card.id} />
                          <button type="submit" className={`btn rate ${r}`}>
                            {label}
                            <span className="rate-when">
                              {p.days > 0 ? `${p.days} ${t.learn.days}` : `${p.minutes} ${t.learn.minutes}`}
                            </span>
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </>
              )}

              <form action={removeFromDeck} className="review-remove">
                <input type="hidden" name="lexemeId" value={card.lexemeId} />
                <button type="submit" className="btn small-btn">{t.learn.remove}</button>
              </form>
            </article>
          )}

          <p className="conj-note">{t.learn.algo}</p>
        </section>
      </div>
    </>
  );
}
