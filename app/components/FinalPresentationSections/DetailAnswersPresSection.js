// DetailAnswersPresSection.js
// Container for the answer-reveal stage. A sequence — one slide per comprehension
// item — each rendered as an AnswerRevealSlide in its own reveal <section>. The
// answer fades in on arrow via a fragment inside the themed slide.
//
// Knows Zustand (via the model). Appearance lives in the theme.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useDetailAnswersSlideModel } from "./detailAnswersSlideModel";
import { DETAIL_ANSWERS_SLIDE_COPY as COPY } from "./detailAnswersSlideCopy";

export default function DetailAnswersPresSection() {
  const { slides } = useDetailAnswersSlideModel();
  const AnswerRevealSlide = useSlideComponent("answerReveal");

  if (!AnswerRevealSlide) return null;
  if (slides.length === 0) return null;

  return (
    <>
      {slides.map((slide) => (
        <section key={slide.id} className="slide-full">
          <AnswerRevealSlide
            label={slide.label}
            answerLabel={COPY.answerAccent}
            question={slide.question}
            answer={slide.answer}
          />
        </section>
      ))}
    </>
  );
}
