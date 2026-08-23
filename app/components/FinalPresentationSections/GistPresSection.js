// GistPresSection.js
// Container for the gist stage. Two slides now:
//   1. the setup slide (listen once / here's the gist question), and
//   2. an answer-reveal slide — the gist answer fades in on the next arrow
//      press (reveal.js fragment), reusing the shared AnswerRevealSlide.
//
// Knows about Zustand (via the model). Does not know what the slides look like.
// The answer-reveal slide is only rendered when there's an answer to show.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useGistSlideModel } from "./gistSlideModel";
import { GIST_SLIDE_COPY as COPY } from "./gistSlideCopy";

export default function GistPresSection() {
  const model = useGistSlideModel();
  const GistSlide = useSlideComponent("gist");
  const AnswerRevealSlide = useSlideComponent("answerReveal");

  // A theme that hasn't implemented the gist slide drops it rather than
  // breaking the deck mid-lesson.
  if (!GistSlide) return null;

  const { answerReveal } = model;
  const showAnswer =
    AnswerRevealSlide && answerReveal && answerReveal.answer.length > 0;

  return (
    <>
      {/* 1. Setup slide */}
      <section className="slide-full">
        <GistSlide {...model} />
      </section>

      {/* 2. Answer reveal — only if there's an answer stored */}
      {showAnswer && (
        <section className="slide-full">
          <AnswerRevealSlide
            label={answerReveal.label}
            answerLabel={COPY.answerAccent}
            question={answerReveal.question}
            answer={answerReveal.answer}
          />
        </section>
      )}
    </>
  );
}
