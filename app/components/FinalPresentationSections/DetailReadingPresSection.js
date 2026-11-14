"use client";
// DetailReadingPresSection.js — deck slides for "Reading for detail".
// Reads the STRUCTURED items (useReadingStore.readingItems). Sequence:
//   1. Instructions
//   2. [optional] Partner check                              — stage config.checkOn
//   3. [optional] Whole-text passage slide(s)                — detailConfig.showPassage
//   4. [optional] Slide-by-slide reveal — question → answer → its evidence
//                 passage(s) from the text                   — detailConfig.showSlideBySlide
//   5. [optional] Recap: every reviewed Q+A on one slide     — detailConfig.showAllOnOneSlide
// Per-question "review" + the modes live in detailConfig (same store listening
// uses). Partner-check + time live in this stage's own config.

import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import AnswerRevealSlide from "@app/presentation/theme/hedonic/AnswerRevealSlide";
import AnswerListSlide from "@app/presentation/theme/hedonic/AnswerListSlide";
import ReadingPassageSlide from "@app/presentation/theme/hedonic/ReadingPassageSlide";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";
import { wholeTextString, textParagraphs, paragraphOf } from "./readingDetailModel";
import { getDetailModes, getQuestionFlags } from "./detailConfigHelpers";

const DEFAULT_PHRASES = ["What did you put for number ___?", "I put ___."];
const CFG_DEFAULTS = { timeMinutes: 8, showTimer: true, checkOn: false, checkPhrases: DEFAULT_PHRASES };
const TEXT_DEMO = { title: "A day in Hanoi", exercisePage: "43", exercise: "2 and 3" };
const DEMO_ITEMS = [
  { number: "1", question: "Where does Minh live?", answer: "In Hanoi", passages: [{ text: "Minh lives in a small house in Hanoi." }] },
  { number: "2", question: "Is the market busy?", answer: "True", passages: [{ text: "The market near his house is always crowded." }] },
  { number: "3", question: "What time does he start work?", answer: "At 6 a.m.", passages: [] },
];

const passageTexts = (it) =>
  (Array.isArray(it?.passages) ? it.passages : [])
    .map((p) => (typeof p === "string" ? p : p?.text || ""))
    .map((s) => s.trim())
    .filter(Boolean);

export default function DetailReadingPresSection({ item }) {
  const storedCfg = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const detailConfig = useAudioTextStore((s) => s.detailConfig);
  const inputTexts = useReadingStore((s) => s.inputTexts);
  const readingItems = useReadingStore((s) => s.readingItems);
  const textbook = useReadingStore((s) => s.textbook);
  const paragraphs = textParagraphs(wholeTextString(textbook));

  const c = { ...CFG_DEFAULTS, ...(storedCfg || {}) };
  const t = inputTexts && Object.keys(inputTexts).length ? inputTexts : TEXT_DEMO;
  const phrases = Array.isArray(c.checkPhrases) && c.checkPhrases.length ? c.checkPhrases : DEFAULT_PHRASES;

  const modes = getDetailModes(detailConfig);
  const showPassage = detailConfig?.showPassage ?? true;

  const real = (readingItems || []).filter((it) => (it.answer || "").trim() || (it.question || "").trim());
  const source = real.length ? real : DEMO_ITEMS;
  const reviewed = source
    .map((it, i) => ({ it, i }))
    .filter(({ i }) => getQuestionFlags(detailConfig, i).review)
    .map(({ it, i }) => ({
      id: `rd-${i}`,
      label: `Number ${it.number}`,
      question: it.question || `Number ${it.number}`,
      answer: it.answer,
      passages: passageTexts(it).map((text) => ({ text, para: paragraphOf(text, paragraphs) })),
      explanation: (it.explanation || "").trim(),
    }));

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

      {showPassage &&
        paragraphs.map((p, i) => (
          <section key={`passage-${i}`} className="slide-full">
            <ReadingPassageSlide title={t.title ? t.title : "The text"} passage={p} index={i} total={paragraphs.length} />
          </section>
        ))}

      {modes.showSlideBySlide &&
        reviewed.map((slide) => (
          <section key={slide.id} className="slide-full">
            <AnswerRevealSlide
              label={slide.label}
              answerLabel="Answer"
              question={slide.question}
              answer={slide.answer}
              passage={slide.passages}
              explanation={slide.explanation}
            />
          </section>
        ))}

      {modes.showAllOnOneSlide && reviewed.length > 0 && (
        <section className="slide-full">
          <AnswerListSlide title="Answers" items={reviewed.map((s) => ({ id: s.id, question: s.question, answer: s.answer }))} />
        </section>
      )}
    </>
  );
}
