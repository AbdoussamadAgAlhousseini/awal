"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/quiz";

type Labels = {
  score: string;
  qMeaning: string;
  qWord: string;
  qScript: string;
  correct: string;
  wrong: string;
  next: string;
  finish: string;
  replay: string;
  readMore: string;
};

/** Quiz interactif : retour immédiat, score de session, rejeu. Aucun état serveur. */
export default function Quiz({
  questions,
  labels,
  questionTemplate,
  finalTemplate,
}: {
  questions: Question[];
  labels: Labels;
  // Gabarits sérialisables (pas de fonction à travers la frontière serveur→client).
  questionTemplate: string; // « Question {i} / {n} »
  finalTemplate: string; // « {score} / {total} … »
}) {
  const fmtQuestion = (i: number, n: number) =>
    questionTemplate.replace("{i}", String(i)).replace("{n}", String(n));
  const fmtFinal = (score: number, total: number) =>
    finalTemplate.replace("{score}", String(score)).replace("{total}", String(total));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;

  function choose(id: string) {
    if (answered) return;
    setSelected(id);
    if (id === q.correctId) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-done">
        <div className="quiz-score-big">{score}<span className="quiz-slash">/{questions.length}</span></div>
        <p className="muted">{fmtFinal(score, questions.length)} · {pct}%</p>
        <Link href="/jouer" prefetch={false} className="btn primary">{labels.replay}</Link>
      </div>
    );
  }

  const prompt =
    q.kind === "meaning" ? labels.qMeaning : q.kind === "word" ? labels.qWord : labels.qScript;

  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="quiz-progress">{fmtQuestion(index + 1, questions.length)}</span>
        <span className="quiz-scoreline">{labels.score} : <b>{score}</b></span>
      </div>
      <div className="quiz-bar"><div className="quiz-bar-fill" style={{ width: `${(index / questions.length) * 100}%` }} /></div>

      <div className="quiz-prompt">
        <div className="quiz-question">{prompt}</div>
        {q.promptTif && <div className="quiz-tif tif">{q.promptTif}</div>}
        {q.promptLat && <div className="quiz-lat">{q.promptLat}</div>}
        {q.promptGloss && <div className="quiz-gloss" dir="auto">{q.promptGloss}</div>}
      </div>

      <div className="quiz-options">
        {q.options.map((o) => {
          let cls = "quiz-opt";
          if (answered) {
            if (o.id === q.correctId) cls += " ok";
            else if (o.id === selected) cls += " ko";
            else cls += " dim";
          }
          return (
            <button key={o.id} className={cls} onClick={() => choose(o.id)} disabled={answered}>
              {o.tif && <span className="quiz-opt-tif tif">{o.tif}</span>}
              <span className="quiz-opt-label" dir="auto">{o.label}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="quiz-feedback">
          <span className={selected === q.correctId ? "quiz-verdict ok" : "quiz-verdict ko"}>
            {selected === q.correctId ? labels.correct : labels.wrong}
          </span>
          <Link href={`/mot/${q.correctId}`} prefetch={false} className="quiz-link">{labels.readMore}</Link>
          <button className="btn primary" onClick={next}>{isLast ? labels.finish : labels.next}</button>
        </div>
      )}
    </div>
  );
}
