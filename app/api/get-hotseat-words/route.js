// app/api/get-hotseat-words/route.js
// AI word suggestions for the Hot Seat activity. Given the set's theme, the
// active sources, and whatever lesson content exists, returns 6 describable
// words graded EASY → HARD. Same infra as the other Gemini routes
// (ensureGcpCredentials + GEMINI_MODEL via Vertex).
//
// Input:  { theme?, level?, count?, sources?, transcript?, gist?,
//           questionsAndAnswers?, mode?, existingWords? }
//   sources: { lessonMaterials, vocabScreenshots, generic, genericLevel }
//   mode:    "words" (fill a set) | "extension" (a harder, related set)
// Output: { theme, words: [ ... ] }
//
// NOTE: the vocab-screenshots source has no data until the Vocabulary Source
// page exists (Stage 3); until then the route works off lesson content +
// generic-by-level. It degrades gracefully when no content is available.

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const POST = async (req) => {
  try {
    const {
      theme = "",
      level = "B1",
      count = 6,
      sources = {},
      transcript = "",
      gist = "",
      questionsAndAnswers = [],
      mode = "words",
      existingWords = [],
      vocabScreenshotWords = [],
    } = await req.json();

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const n = Math.max(1, Math.min(6, parseInt(count, 10) || 6));
    const lvl = LEVELS.includes(level) ? level : "B1";

    // Normalise lesson content.
    const gistStr =
      typeof gist === "string"
        ? gist
        : gist && gist.question
          ? `${gist.question} ${gist.answer || ""}`
          : "";
    const qa = Array.isArray(questionsAndAnswers)
      ? questionsAndAnswers
          .map((it) =>
            `${it.question ?? it.text ?? ""} ${it.answer ?? ""}`.trim(),
          )
          .filter(Boolean)
          .join(" · ")
      : "";
    const useLesson =
      !!sources.lessonMaterials && !!(transcript || gistStr || qa);
    const useGeneric = !!sources.generic;

    const ctx = useLesson
      ? `\n\nLESSON CONTENT (draw theme-relevant, describable words from here):\n${[
          gistStr,
          transcript,
          qa,
        ]
          .filter(Boolean)
          .join("\n")
          .slice(0, 4000)}`
      : "";

    // Vocab screenshots source: the teacher's own extracted target vocabulary.
    const vocabWordsStr = Array.isArray(vocabScreenshotWords)
      ? vocabScreenshotWords.filter(Boolean).join(", ")
      : "";
    const useVocabScreens = !!sources.vocabScreenshots && !!vocabWordsStr;
    const vocabCtx = useVocabScreens
      ? `\n\nTARGET VOCABULARY (the teacher's own words from their coursebook screenshots — build the set from THESE words where possible, choosing the most describable and grading them EASY → HARD):\n${vocabWordsStr.slice(0, 2000)}`
      : "";

    const themeLine = theme
      ? `on the theme "${theme}"`
      : useLesson
        ? `on a clear theme you choose from the lesson content`
        : `on a clear, useful everyday theme you choose`;

    const sourceLine =
      useGeneric && !useLesson
        ? `Use generic, level-appropriate ${lvl} vocabulary.`
        : useGeneric && useLesson
          ? `Prefer words from the lesson content, topped up with level-appropriate ${lvl} vocabulary.`
          : useLesson
            ? `Draw the words from the lesson content.`
            : `Use level-appropriate ${lvl} vocabulary.`;

    const modeLine =
      mode === "extension"
        ? ` These are EXTENSION words: go a notch HARDER and BROADER than the obvious set — related concepts, collocations, less common items. Do NOT repeat any of these already-used words: ${
            (existingWords || []).filter(Boolean).join(", ") || "(none)"
          }.`
        : "";

    const prompt = `You are an ESL teacher building a "Hot Seat" describe-and-guess vocabulary game for ${lvl} students. Produce ${n} single words or short noun/verb phrases ${themeLine} that a student can DESCRIBE out loud to a partner (concrete and describable — not abstract grammar words, not proper nouns). Order them EASY → HARD: most common / most concrete first, least common / most abstract last. ${sourceLine}${modeLine}${ctx}${vocabCtx}\n\nReturn ONLY a JSON object: {"theme": "<short theme name>", "words": ["w1", …, "w${n}"]}. No other text.`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let text = (response.text ?? "").replace(/```json\s*|```/g, "").trim();
    let out;
    try {
      out = JSON.parse(text);
    } catch {
      out = {};
    }

    let words = Array.isArray(out.words)
      ? out.words
          .filter((w) => typeof w === "string" && w.trim())
          .map((w) => w.trim())
          .slice(0, n)
      : [];
    while (words.length < n) words.push("");
    const outTheme = typeof out.theme === "string" ? out.theme.trim() : "";

    return Response.json({ theme: outTheme, words }, { status: 200 });
  } catch (error) {
    console.error("get-hotseat-words error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
};
