// DetailPresSection.js
// Container for the "Listen for Detail" stage. Detail is a single task-
// instructions slide, so it reuses the theme's InstructionSlide (same shape as
// the scramble instructions): a framed title + task bullets. No questions or
// audio on screen — students do the exercise in their book.
//
// Knows Zustand (via the model). Does not know what the slide looks like.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useDetailSlideModel } from "./detailSlideModel";

export default function DetailPresSection() {
  const model = useDetailSlideModel();

  // Detail reuses the same themed component as the scramble instructions.
  const InstructionSlide = useSlideComponent("scrambleInstruction");

  if (!InstructionSlide) return null;

  return (
    <section className="slide-full">
      <InstructionSlide
        title={model.title}
        titleAccent={model.titleAccent}
        lines={model.lines}
        compact
      />
    </section>
  );
}
