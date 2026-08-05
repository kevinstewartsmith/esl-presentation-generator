// detailSlideCopy.js
// Wording + placeholder values for the "Listen for Detail" task-instructions
// slide. Same rationale as the other *SlideCopy files: task wording lives here.
//
// The PLACEHOLDER_* values below stand in until they're wired to real inputs:
//   - book / page / exercise / answerLocation  -> will come from inputs beside
//     the audio drag-drop (like the reading stage has)
//   - grouping / talkingRule / timeLimit        -> will come from the detail
//     stage's Configure card
// Keeping them here (not in the model logic) means the swap later is one place.

export const DETAIL_SLIDE_COPY = {
  title: "Listen for",
  titleAccent: "Detail",

  // Placeholder task values (replace with store/config data later).
  placeholders: {
    exercise: "5",
    page: "100",
    answerLocation: "in your notebook",
    grouping: "Work with a partner",
    talkingRule: "Quiet voices only",
    timeLimit: "You have 5 minutes",
  },

  // Builders — take the resolved values and produce the bullet text. Keeping the
  // phrasing here means copy edits don't touch the model.
  taskLine: ({ exercise, page, answerLocation }) =>
    `Complete Exercise ${exercise} on page ${page} — write your answers ${answerLocation}`,
};
