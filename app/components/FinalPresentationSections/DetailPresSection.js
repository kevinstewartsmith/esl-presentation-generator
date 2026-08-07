// DetailPresSection.js
// Container for the "Listen for Detail" stage. Two parts, rendered in order:
//   1. The task-instructions slide (do the exercise in your book), and
//   2. The answer-reveal sequence — one slide per comprehension question, the
//      answer fading in on the next arrow press (reveal.js fragment).
//
// Knows Zustand (via the models). Appearance lives in the theme.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useDetailSlideModel } from "./detailSlideModel";
import { useDetailAnswersSlideModel } from "./detailAnswersSlideModel";
import { DETAIL_ANSWERS_SLIDE_COPY as ANSWERS_COPY } from "./detailAnswersSlideCopy";

export default function DetailPresSection() {
  const model = useDetailSlideModel();
  const { slides: answerSlides } = useDetailAnswersSlideModel();

  // Task slide reuses the scramble-instructions component; answers use their own.
  const InstructionSlide = useSlideComponent("scrambleInstruction");
  const AnswerRevealSlide = useSlideComponent("answerReveal");

  if (!InstructionSlide) return null;

  return (
    <>
      {/* 1. The task instructions */}
      <section className="slide-full">
        <InstructionSlide
          title={model.title}
          titleAccent={model.titleAccent}
          lines={model.lines}
          compact
        />
      </section>

      {/* 2. The answer reveal — one slide per question, answer fades in on arrow */}
      {AnswerRevealSlide &&
        answerSlides.map((slide) => (
          <section key={slide.id} className="slide-full">
            <AnswerRevealSlide
              label={slide.label}
              answerLabel={ANSWERS_COPY.answerAccent}
              question={slide.question}
              answer={slide.answer}
            />
          </section>
        ))}
    </>
  );
}
