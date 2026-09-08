// detailSlideCopy.js
// Wording + placeholder values for the "Listen for Detail" task-instructions
// slide. Task wording lives here so copy edits don't touch the model.
//
// Page / exercise / book now come from the teacher's inputTexts (entered beside
// the audio drop). These placeholders are the fallback when a field is blank.
// grouping / talkingRule / timeLimit are still placeholders pending the detail
// Configure card.

export const DETAIL_SLIDE_COPY = {
  title: "Listen for",
  titleAccent: "Detail",

  placeholders: {
    exercise: "5",
    page: "100",
    answerLocation: "in your notebook",
    grouping: "Work with a partner",
    talkingRule: "Quiet voices only",
    timeLimit: "You have 5 minutes",
  },

  // Build the task line. `book` is optional — included only when provided.
  taskLine: ({ exercise, page, book, answerLocation }) => {
    const where = book ? `${book}, page ${page}` : `page ${page}`;
    return `Complete Exercise ${exercise} on ${where} — write your answers ${answerLocation}`;
  },
};
