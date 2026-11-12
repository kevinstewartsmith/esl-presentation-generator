"use client";
// GistReadingPresSection.js
// Deck slide for the "Reading for gist" stage. Book reference (book/page/title)
// comes from the shared, lesson-wide useReadingStore.inputTexts (in sync with
// the Source page); the gist-specific bits (question/time/timer) come from the
// stage's own config (stageActivities[item.id].config). One hedonic
// InstructionSlide, content mirroring the old GistReadingInstructions.

import SlideFrame from "@app/presentation/theme/hedonic/SlideFrame";
import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const CFG_DEMO = { gistQuestion: "Where does the writer live?", timeMinutes: 3, showTimer: true };
const TEXT_DEMO = { book: "Think 3", page: "42", title: "A day in Hanoi" };

export default function GistReadingPresSection({ item }) {
  const storedCfg = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const inputTexts = useReadingStore((s) => s.inputTexts);

  const c = storedCfg && Object.keys(storedCfg).length ? storedCfg : CFG_DEMO;
  const t =
    inputTexts && Object.keys(inputTexts).length ? inputTexts : TEXT_DEMO;

  const lines = [
    t.book || t.page
      ? `Open ${t.book || "your book"}${t.page ? ` to p.${t.page}` : ""}`
      : "Open your book",
    `Read ${t.title ? `'${t.title}'` : "the text"} quickly`,
    c.gistQuestion ? `Answer: ${c.gistQuestion}` : "Find the main idea",
    "No talking",
  ];
  if (c.showTimer && c.timeMinutes) {
    lines.push(`${c.timeMinutes} ${c.timeMinutes === 1 ? "minute" : "minutes"}`);
  }

  return (
    <section className="slide-full">
      <InstructionSlide title="Reading for" titleAccent="Gist" lines={lines} />
    </section>
  );
}
