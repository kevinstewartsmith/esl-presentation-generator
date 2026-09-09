// DifficultyPrompt.js
// Builds the prompt that CEFR-rates each detail comprehension question.
//
// The construct (designed deliberately): a question's CEFR level is a BLEND of
// two factors, both evidenced from the inputs (transcript + question + answer):
//
//   1. INFERENTIAL DISTANCE — how directly the answer is supported in the
//      transcript. Stated explicitly ("tapped on the nose") = low; must be
//      inferred from attitude / implication / synthesis across the text = high.
//      This is the core CEFR listening construct (explicit retrieval -> reading
//      between the lines).
//   2. LANGUAGE LEVEL — the vocabulary + grammatical complexity of the words in
//      the transcript, the question, AND the answer (CEFR lexical/grammatical
//      bands).
//
// A question is low-level only if BOTH explicit AND accessible language; high if
// either the language is advanced OR heavy inference is required (especially
// both). Anchored on the official CEFR listening can-do descriptors below so the
// rating maps to the framework, not the model's gut.

const CEFR_LISTENING_ANCHORS = `CEFR listening can-do anchors (use these to place each question):
- A1: understands very short, simple, clearly and slowly articulated speech; catches concrete, explicitly stated words (names, numbers, times, simple facts).
- A2: understands enough to meet concrete needs; catches the main point in short, clear, simple messages; explicit key information.
- B1: understands the main points of clear standard speech on familiar matters; can follow a straightforward line of argument; mostly explicit but requires following a thread.
- B2: understands extended speech and follows complex lines of argument; grasps implicit meaning, speaker attitude, and viewpoint; can infer information not stated directly.
- C1: understands a wide range of demanding, longer speech; grasps implicit meaning, idiomatic and colloquial usage, nuance, and abstract or unfamiliar topics.
- C2: understands any kind of spoken language including fast, idiomatic, or heavily nuanced speech; effortlessly grasps subtext and fine shades of meaning.`;

export function buildDifficultyPrompt(transcript, questions) {
  const numbered = questions
    .map((q, i) => {
      const question = (q?.question ?? "").trim();
      const answer = (q?.answer ?? "").trim();
      return `${i + 1}. QUESTION: ${question}\n   ANSWER: ${answer}`;
    })
    .join("\n");

  return `You are an experienced ESL assessor. Rate the CEFR listening difficulty of each comprehension question below, so a teacher can decide which are worth reviewing.

Rate each question by BLENDING two factors, both judged from the evidence:

FACTOR 1 — Inferential distance: Locate where/how the answer is supported in the transcript. Is it stated EXPLICITLY (the student just catches a stated word or fact), or must the student INFER it (from attitude, implication, or by synthesising information across the text)? Explicit = lower; inference = higher.

FACTOR 2 — Language level: Judge the vocabulary and grammatical complexity of the language the student must understand — in the transcript passage that holds the answer, in the question, and in the answer. Simple/high-frequency = lower; advanced/idiomatic/complex = higher.

Combine them: a question is only low-level (A1/A2) if it is BOTH explicit AND in accessible language. It is high-level (B2+) if EITHER the language is advanced OR heavy inference is required — and especially if both.

${CEFR_LISTENING_ANCHORS}

Return ONLY valid JSON — an array with one object PER QUESTION, in the same order, each:
{"level": "A1|A2|B1|B2|C1|C2", "reason": "one short sentence naming which factor drove the rating"}
No markdown, no code fences, no other text.

TRANSCRIPT:
${transcript}

QUESTIONS:
${numbered}`;
}
