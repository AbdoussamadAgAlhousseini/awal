import Link from "next/link";
import { db } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { messages, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { buildQuiz, type QuizEntry } from "@/lib/quiz";
import SiteHeader from "@/components/SiteHeader";
import Quiz from "@/components/Quiz";

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

export default async function Play() {
  const locale: Locale = (await getLocale()) ?? DEFAULT_LOCALE;
  const t = messages[locale];

  const rows = await db.lexeme.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      headword: true,
      tifinagh: true,
      senses: { orderBy: { order: "asc" }, take: 1, select: { defShort: true, translations: true } },
    },
  });

  // L'identifiant d'option est le SLUG : « en savoir plus » pointe vers /mot/<slug>.
  const entries: QuizEntry[] = rows.map((r) => ({
    id: r.slug,
    headword: r.headword,
    tifinagh: r.tifinagh,
    gloss: r.senses[0] ? gloss(locale, r.senses[0].defShort, r.senses[0].translations) : "",
  }));

  const questions = buildQuiz(entries, 10);

  return (
    <>
      <SiteHeader locale={locale} next="/jouer" />
      <div className="wrap">
        <section className="panel-section">
          <h2 className="ptitle">{t.quiz.title}</h2>
          <p className="muted">{t.quiz.intro}</p>

          {questions.length === 0 ? (
            <div className="flash warn">{t.quiz.tooFew}</div>
          ) : (
            <Quiz
              questions={questions}
              questionTemplate={t.quiz.questionOf}
              finalTemplate={t.quiz.finalScore}
              labels={{
                score: t.quiz.score,
                qMeaning: t.quiz.qMeaning,
                qWord: t.quiz.qWord,
                qScript: t.quiz.qScript,
                correct: t.quiz.correct,
                wrong: t.quiz.wrong,
                next: t.quiz.next,
                finish: t.quiz.finish,
                replay: t.quiz.replay,
                readMore: t.enc.readMore,
              }}
            />
          )}

          <p style={{ marginTop: 24 }}>
            <Link href="/apprendre" className="back">← {t.nav.learn}</Link>
          </p>
        </section>
      </div>
    </>
  );
}
