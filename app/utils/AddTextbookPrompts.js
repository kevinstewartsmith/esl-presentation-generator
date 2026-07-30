// addTextbookPrompts.js
// Prompts for Gemini-vision extraction of textbook screenshots (the cousin to
// prompts.js, which holds the ChatGPT text prompts).
//
// One BASE_PROMPT (stable JSON contract + faithfulness rules) plus a
// CATEGORY_PROMPTS map (category -> extra instructions). buildTextbookPrompt()
// concatenates the base with the right fragment. Adding a category = adding a
// key — same lookup-map pattern used elsewhere in the app.
//
// The real category strings come from ListeningQuestionUploader + ReadingContent:
//   Questions:   "QuestionText", "ListeningQuestionText"
//   Answers:     "AnswerText",   "ListeningAnswersText"
//   Book text:   "BookText"
//   Transcript:  "ListeningTranscript"
// Several keys share one fragment (a listening question and a reading question
// extract the same way).
//
// "BookText" and "ListeningTranscript" define their OWN output shape in their
// fragments (they override the questions container, not just append).

export const BASE_PROMPT = `You are helping an ESL teacher digitize exercises from a textbook page. You will be given an image of part of a textbook.

Extract the content into structured JSON. Transcribe faithfully — copy the text exactly as it appears. Do not invent, rephrase, correct, translate, or answer anything that is not already answered in the image.

Unless a section below tells you otherwise, return an object with this shape:
{
  "instructions": string | null,   // any instruction/rubric line for the exercise, or null if none
  "questions": [
    {
      "number": string,     // the question's label exactly as shown ("1", "a", "iii"), or "" if unnumbered
      "text": string,       // the question or item text, or "" if none is shown
      "type": string,       // classify: "multiple_choice", "gap_fill", "short_answer", "true_false", "matching" — or a short descriptive label if none of those fit
      "options": string[],  // answer choices if the image shows them; otherwise an empty array
      "answer": string      // the answer ONLY if it is printed in the image; otherwise ""
    }
  ]
}

General rules:
- Preserve the original numbering/lettering exactly; do not renumber.
- If a question shows no options, use an empty array.
- If no answer is printed, use an empty string — never guess or solve.
- Return ONLY the JSON. No markdown, no code fences, no commentary.`;

// Fragments (defined once, then mapped to the real category keys below).
const QUESTIONS_FRAGMENT = `This image shows exercise QUESTIONS. They may be reading, listening, or vocabulary questions — any type.

Extract every question using the shape above. Classify each question's "type". If answer options are printed on the page (e.g. a/b/c/d for multiple choice, or a word bank), capture them in "options". Leave "answer" as "" — a questions page does not contain the answers.`;

const ANSWERS_FRAGMENT = `This image shows an ANSWER KEY: correct answers numbered or lettered to match an exercise.

Ignore the questions shape above. Instead return:
{
  "answers": [
    { "number": string, "answer": string }
  ]
}
Copy "number" exactly as labelled — it is used to match each answer back to its question on a separate page. Transcribe the answer exactly as printed. Return ONLY the JSON.`;

const BOOK_TEXT_FRAGMENT = `This image shows READING TEXT (a passage or prose from the book), not questions.

Ignore the questions shape above. Instead return:
{
  "text": string   // the full passage, transcribed faithfully, preserving paragraph breaks
}
Do not summarize, correct, or add anything. Return ONLY the JSON.`;

const TRANSCRIPT_FRAGMENT = `This image shows a book-provided AUDIO TRANSCRIPT for a listening exercise.

Ignore the questions shape above. Instead return:
{
  "lines": [
    { "speaker": string, "text": string }   // "speaker" is "" if the transcript is not a labelled dialogue
  ]
}
Transcribe faithfully in order. Do not invent speaker labels that are not shown. Return ONLY the JSON.`;

export const CATEGORY_PROMPTS = {
  // Questions (reading + listening share the same extraction)
  QuestionText: QUESTIONS_FRAGMENT,
  ListeningQuestionText: QUESTIONS_FRAGMENT,

  // Answer keys (reading + listening)
  AnswerText: ANSWERS_FRAGMENT,
  ListeningAnswersText: ANSWERS_FRAGMENT,

  // Reading passage — own shape
  BookText: BOOK_TEXT_FRAGMENT,

  // Book-provided listening transcript — own shape
  ListeningTranscript: TRANSCRIPT_FRAGMENT,
};

// Assemble the full prompt for a category. Unknown categories fall back to the
// base prompt alone (graceful — still returns the questions container).
export function buildTextbookPrompt(category) {
  const fragment = CATEGORY_PROMPTS[category] ?? "";
  return fragment ? `${BASE_PROMPT}\n\n${fragment}` : BASE_PROMPT;
}
