// detailAnswersSlideModel.js
// Answer-reveal is a SEQUENCE — one slide per comprehension item — so the model
// returns an ORDERED ARRAY (like scramble). Each slide carries the question and
// its answer; the theme reveals the answer as a reveal.js fragment.
//
// VIEW MODEL CONTRACT (detailAnswers): an array of slides, each:
//   {
//     id:       string
//     label:    string   // "Question 1"
//     question: string
//     answer:   string
//   }
//
// Pulls from comprehensionItems (item.question / item.answer), the same source
// as gist/scramble.
//
// FLAG (later): layout options — instead of one-slide-per-question, allow
// all-questions-on-one-slide revealing one-by-one. One-per-slide is the default.

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { DETAIL_ANSWERS_SLIDE_COPY as COPY } from "./detailAnswersSlideCopy";

export function useDetailAnswersSlideModel() {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);

  const items = (comprehensionItems ?? []).filter(
    (item) => (item?.question ?? "").trim() || (item?.answer ?? "").trim(),
  );

  const slides = items.map((item, i) => ({
    id: `answer-${i}`,
    label: COPY.questionLabel(i + 1),
    question: (item.question ?? "").trim(),
    answer: (item.answer ?? "").trim(),
  }));

  return { slides };
}
