// detailSlideModel.js
// Builds the "Listen for Detail" task-instructions view model. Detail is a
// simple single instructions slide (framed title + task bullets) — students do
// the exercise in their book, so there are NO questions or audio on screen.
//
// VIEW MODEL CONTRACT (detail): the same shape InstructionSlide already consumes
//   {
//     title:       string
//     titleAccent: string
//     lines:       string[]   // the task bullets, in order
//   }
//
// Values are placeholders for now (see detailSlideCopy). When the real inputs
// exist, read them from the store here and fall back to the placeholders.

import { DETAIL_SLIDE_COPY as COPY } from "./detailSlideCopy";

export function useDetailSlideModel() {
  // LATER: pull these from the store (audio-drop inputs + Configure card),
  // falling back to placeholders. For now, use placeholders directly.
  const {
    exercise,
    page,
    answerLocation,
    grouping,
    talkingRule,
    timeLimit,
  } = COPY.placeholders;

  const lines = [
    COPY.taskLine({ exercise, page, answerLocation }),
    grouping,
    talkingRule,
    timeLimit,
  ].filter(Boolean); // drop any that are empty when values become optional

  return {
    title: COPY.title,
    titleAccent: COPY.titleAccent,
    lines,
  };
}
