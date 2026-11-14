"use client";
// GistReadingPresSection.js
// Deck slides for the "Reading for gist" stage. A SEQUENCE:
//   1. Instructions (open book, read, the gist question, time)
//   2. [optional] Partner check (editable A/B phrases) — only if checkOn
//   3. Gist answer reveal — the chosen gist answer fades in on arrow
// Book reference comes from shared useReadingStore.inputTexts; the gist
// question/answer come from the shared selectedGist (generated in the card);
// time + partner-check live in the stage's own config.

import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import AnswerRevealSlide from "@app/presentation/theme/hedonic/AnswerRevealSlide";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const DEFAULT_PHRASES = ["What did you put for number ___?", "I put ___."];
const CFG_DEFAULTS = { timeMinutes: 3, showTimer: true, checkOn: false, checkPhrases: DEFAULT_PHRASES };
const TEXT_DEMO = { book: "Think 3", page: "42", title: "A day in Hanoi" };
const GIST_DEMO = { question: "Where does the writer live?", answer: "In Hanoi, Vietnam" };

export default function GistReadingPresSection({ item }) {
  const storedCfg = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const selectedGist = useAudioTextStore((s) => s.selectedGist);
  const inputTexts = useReadingStore((s) => s.inputTexts);

  const c = { ...CFG_DEFAULTS, ...(storedCfg || {}) };
  const t = inputTexts && Object.keys(inputTexts).length ? inputTexts : TEXT_DEMO;
  const gist = selectedGist && selectedGist.question ? selectedGist : GIST_DEMO;
  const phrases = Array.isArray(c.checkPhrases) && c.checkPhrases.length ? c.checkPhrases : DEFAULT_PHRASES;

  const lines = [
    t.book || t.page ? `Open ${t.book || "your book"}${t.page ? ` to p.${t.page}` : ""}` : "Open your book",
    `Read ${t.title ? `'${t.title}'` : "the text"} quickly`,
    gist.question ? `Answer: ${gist.question}` : "Find the main idea",
    "No talking",
  ];
  if (c.showTimer && c.timeMinutes) {
    lines.push(`${c.timeMinutes} ${c.timeMinutes === 1 ? "minute" : "minutes"}`);
  }

  const checkLines = phrases.map((p, i) => `${i % 2 === 0 ? "A" : "B"}: ${p}`);

  return (
    <>
      <section className="slide-full">
        <InstructionSlide title="Reading for" titleAccent="Gist" lines={lines} />
      </section>

      {c.checkOn && (
        <section className="slide-full">
          <InstructionSlide title="Partner" titleAccent="Check" lines={checkLines} numbered={false} allPrimary />
        </section>
      )}

      <section className="slide-full">
        <AnswerRevealSlide label="Gist" answerLabel="Answer" question={gist.question} answer={gist.answer} />
      </section>
    </>
  );
}
