"use client";
// DetailReadingPresSection.js — deck slides for "Reading for detail". A SEQUENCE:
//   1. Instructions (read the text, do the exercises, time)
//   2. [optional] Partner check (editable A/B phrases) — only if checkOn
//   3. Answer reveals — one slide per answer-key item, matched to its question
//      by number; the answer fades in on arrow.
// Book reference from shared useReadingStore.inputTexts; answers from
// useReadingStore.answers ({ answers:[{number,answer}] }); questions, when
// present, supply the prompt text (useReadingStore.questions).

import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import AnswerRevealSlide from "@app/presentation/theme/hedonic/AnswerRevealSlide";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const DEFAULT_PHRASES = ["What did you put for number ___?", "I put ___."];
const CFG_DEFAULTS = { timeMinutes: 8, showTimer: true, checkOn: false, checkPhrases: DEFAULT_PHRASES };
const TEXT_DEMO = { title: "A day in Hanoi", exercisePage: "43", exercise: "2 and 3" };
const ANSWERS_DEMO = [
  { number: "1", answer: "True" },
  { number: "2", answer: "False" },
  { number: "3", answer: "He takes the bus" },
];

function answerList(answers) {
  if (!answers) return [];
  if (Array.isArray(answers)) return answers;
  if (Array.isArray(answers.answers)) return answers.answers;
  return [];
}
function questionList(questions) {
  if (!questions) return [];
  if (Array.isArray(questions)) return questions;
  if (Array.isArray(questions.questions)) return questions.questions;
  return [];
}

export default function DetailReadingPresSection({ item }) {
  const storedCfg = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const inputTexts = useReadingStore((s) => s.inputTexts);
  const answers = useReadingStore((s) => s.answers);
  const questions = useReadingStore((s) => s.questions);

  const c = { ...CFG_DEFAULTS, ...(storedCfg || {}) };
  const t = inputTexts && Object.keys(inputTexts).length ? inputTexts : TEXT_DEMO;
  const phrases = Array.isArray(c.checkPhrases) && c.checkPhrases.length ? c.checkPhrases : DEFAULT_PHRASES;

  const ans = answerList(answers);
  const qs = questionList(questions);
  const qByNum = {};
  qs.forEach((q) => { if (q && q.number != null) qByNum[String(q.number)] = q.text || ""; });

  const revealItems = (ans.length ? ans : ANSWERS_DEMO)
    .filter((a) => (a?.answer ?? "").toString().trim())
    .map((a, i) => {
      const num = a.number != null && String(a.number).trim() ? String(a.number) : String(i + 1);
      const qText = qByNum[num];
      return {
        id: `detail-answer-${i}`,
        label: `Number ${num}`,
        question: qText && qText.trim() ? qText.trim() : `Number ${num}`,
        answer: String(a.answer).trim(),
      };
    });

  const lines = [
    `Read ${t.title ? `'${t.title}'` : "the text"} slowly`,
    t.exercise ? `Complete ${t.exercisePage ? `p.${t.exercisePage} ` : ""}exercise(s): ${t.exercise}` : "Complete the exercises",
    "No talking",
    "Raise your hand when you finish",
  ];
  if (c.showTimer && c.timeMinutes) {
    lines.push(`${c.timeMinutes} ${c.timeMinutes === 1 ? "minute" : "minutes"}`);
  }

  const checkLines = phrases.map((p, i) => `${i % 2 === 0 ? "A" : "B"}: ${p}`);

  return (
    <>
      <section className="slide-full">
        <InstructionSlide title="Reading for" titleAccent="Detail" lines={lines} />
      </section>

      {c.checkOn && (
        <section className="slide-full">
          <InstructionSlide title="Partner" titleAccent="Check" lines={checkLines} numbered={false} allPrimary />
        </section>
      )}

      {revealItems.map((slide) => (
        <section key={slide.id} className="slide-full">
          <AnswerRevealSlide label={slide.label} answerLabel="Answer" question={slide.question} answer={slide.answer} />
        </section>
      ))}
    </>
  );
}
