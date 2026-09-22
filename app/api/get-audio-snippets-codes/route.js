// app/api/get-audio-snippets-codes/route.js
// Passage selection for listening comprehension.
//
// For EACH question, find the transcript passage(s) that justify the answer.
// The model SELECTS up to MAX_PASSAGES by importance (best support first), but
// returns them in TRANSCRIPT (chronological) order. The downstream index stage
// (addIndicesToPassages) also sorts by position as the hard guarantee — the
// prompt wording just gets the raw output close. Ported from gpt-3.5-turbo
// (RapidAPI proxy) to Gemini / Vertex AI — same infra as generate-gist
// (GEMINI_MODEL single source of truth + ensureGcpCredentials).
//
// Input (POST body):
//   {
//     transcript,                                   // full listening transcript
//     questionsAndAnswers: [{ number, question, answer }, ...],
//     maxPassages?                                  // optional per-request override of the knob
//   }
//
// Output:
//   { results: [ { number, passages: ["exact substring", ...] }, ... ] }
//   - passages are the up-to-MAX_PASSAGES most important, in transcript order
//   - passages are VERBATIM substrings of the transcript (downstream index-
//     matching + audio-clip cutting depends on exactness — no paraphrasing)
//   - empty array for a question the model found no support for

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

// ── The knob ──────────────────────────────────────────────────────────────
// Max passages returned per question. Change here to tune globally, or pass
// `maxPassages` in the request body to override per call.
const MAX_PASSAGES = 3;
// ──────────────────────────────────────────────────────────────────────────

export const POST = async (req) => {
  try {
    const { transcript, questionsAndAnswers, maxPassages } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return Response.json({ error: "Missing transcript" }, { status: 400 });
    }
    if (
      !Array.isArray(questionsAndAnswers) ||
      questionsAndAnswers.length === 0
    ) {
      return Response.json(
        { error: "Missing questionsAndAnswers" },
        { status: 400 },
      );
    }

    // The knob, with an optional per-request override.
    const cap =
      Number.isInteger(maxPassages) && maxPassages > 0
        ? maxPassages
        : MAX_PASSAGES;

    // Auth + client: reuse the shared service-account credentials.
    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const qaList = questionsAndAnswers
      .map((qa) => `#${qa.number}\nQ: ${qa.question}\nA: ${qa.answer}`)
      .join("\n\n");

    const prompt = `You are an experienced ESL listening teacher.

Below is a listening TRANSCRIPT and a list of comprehension QUESTIONS with their correct ANSWERS. For EACH question, find the passage(s) in the transcript that justify the answer.

Rules:
- A passage is a VERBATIM substring copied EXACTLY from the transcript — same words, same spelling, no paraphrasing, nothing added or removed. (These passages are used to locate and cut the audio, so exactness is critical.)
- Some answers are stated directly; others are IMPLIED and must be inferred from what a speaker says. Include the passage(s) a student would rely on to reach the answer, whether the support is explicit or implied.
- Choose the up-to-${cap} MOST IMPORTANT passages (the strongest support for the answer), but then return them in the ORDER THEY APPEAR in the transcript — chronological / spoken order, NOT ordered by importance. Fewer than ${cap} is fine. If NO passage in the transcript supports the answer, return an empty array for that question.

Return ONLY valid JSON — no markdown, no code fences, no other text — as an array aligned to the questions, each object shaped exactly:
{"number": <question number>, "passages": ["exact transcript substring", ...]}

TRANSCRIPT:
${transcript}

QUESTIONS AND ANSWERS:
${qaList}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    let text = response.text ?? "";
    text = text.replace(/```json\s*|```/g, "").trim(); // strip accidental fences

    let results;
    try {
      results = JSON.parse(text);
    } catch (e) {
      console.error("Passage-selection JSON parse failed. Raw:", text);
      return Response.json(
        { error: "Model did not return valid JSON" },
        { status: 502 },
      );
    }

    if (!Array.isArray(results)) {
      return Response.json(
        { error: "Expected an array of results" },
        { status: 502 },
      );
    }

    // Normalize: guarantee each item has a capped passages[] array.
    results = results.map((r) => ({
      number: r.number,
      passages: Array.isArray(r.passages) ? r.passages.slice(0, cap) : [],
    }));

    return Response.json({ results }, { status: 200 });
  } catch (error) {
    console.error("get-audio-snippets-codes error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
