"use client";
// PartnerDiscussionPresSection.js — deck slide for "Partner discussion".
// All config is stage-local: the sentence-starter phrases + timer.
import SlideFrame from "@app/presentation/theme/hedonic/SlideFrame";
import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

const DEMO = { phrases: ["I think the writer…", "I agree, and also…"], timeMinutes: 3, showTimer: true };

export default function PartnerDiscussionPresSection({ item }) {
  const stored = useAudioTextStore((s) => s.stageActivities?.[item.id]?.config);
  const c = stored && Object.keys(stored).length ? stored : DEMO;
  const phrases = (Array.isArray(c.phrases) ? c.phrases : []).filter((p) => p && p.trim());

  const lines = [
    "Talk with your partner",
    "Say long answers",
    "Use linking words: and, because, but, so",
  ];
  phrases.forEach((p, i) => lines.push(`${i % 2 === 0 ? "A" : "B"}: ${p}`));
  if (c.showTimer && c.timeMinutes) {
    lines.push(`${c.timeMinutes} ${c.timeMinutes === 1 ? "minute" : "minutes"}`);
  }

  return (
    <section className="slide-full">
      <InstructionSlide title="Partner" titleAccent="Discussion" lines={lines} numbered={false} />
    </section>
  );
}
