"use client";
// DetailReadingPresSection.js — deck slide for "Reading for detail".
// Book reference from shared useReadingStore.inputTexts; time from stage config.
import SlideFrame from "@app/presentation/theme/hedonic/SlideFrame";
import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { useReadingStore } from "@app/stores/useReadingStore";

const CFG_DEMO = { timeMinutes: 8, showTimer: true };
const TEXT_DEMO = { title: "A day in Hanoi", exercisePage: "43", exercise: "2 and 3" };

export default function DetailReadingPresSection({ item }) {
  const storedCfg = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const inputTexts = useReadingStore((s) => s.inputTexts);
  const c = storedCfg && Object.keys(storedCfg).length ? storedCfg : CFG_DEMO;
  const t = inputTexts && Object.keys(inputTexts).length ? inputTexts : TEXT_DEMO;

  const lines = [
    `Read ${t.title ? `'${t.title}'` : "the text"} slowly`,
    t.exercise ? `Complete ${t.exercisePage ? `p.${t.exercisePage} ` : ""}exercise(s): ${t.exercise}` : "Complete the exercises",
    "No talking",
    "Raise your hand when you finish",
  ];
  if (c.showTimer && c.timeMinutes) {
    lines.push(`${c.timeMinutes} ${c.timeMinutes === 1 ? "minute" : "minutes"}`);
  }

  return (
    <section className="slide-full">
      <InstructionSlide title="Reading for" titleAccent="Detail" lines={lines} />
    </section>
  );
}
