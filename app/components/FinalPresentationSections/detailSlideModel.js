// detailSlideModel.js
// Builds the "Listen for Detail" task-instructions view model. Detail is a
// simple single instructions slide (framed title + task bullets) — students do
// the exercise in their book, so there are NO questions or audio on screen.
//
// VIEW MODEL CONTRACT (detail):
//   { title, titleAccent, lines: string[] }
//
// The task line (exercise / page / book) now reads teacher-entered values from
// the listening store's inputTexts, falling back to placeholders. The grouping /
// talking-rule / time-limit still come from placeholders — those will move to the
// detail Configure card (second half of the inputs flag).

import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import { DETAIL_SLIDE_COPY as COPY } from "./detailSlideCopy";

export function useDetailSlideModel() {
  const inputTexts = useAudioTextStore((s) => s.inputTexts);

  const P = COPY.placeholders;

  // Teacher-entered values (fall back to placeholders when blank/absent).
  const exercise = inputTexts?.exercise?.trim() || P.exercise;
  const page = inputTexts?.page?.trim() || P.page;
  const book = inputTexts?.book?.trim() || ""; // optional — only shown if present

  // Still placeholders (move to Configure card later):
  const { answerLocation, grouping, talkingRule, timeLimit } = P;

  const lines = [
    COPY.taskLine({ exercise, page, book, answerLocation }),
    grouping,
    talkingRule,
    timeLimit,
  ].filter(Boolean);

  return {
    title: COPY.title,
    titleAccent: COPY.titleAccent,
    lines,
  };
}
