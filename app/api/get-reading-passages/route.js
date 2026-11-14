// app/api/get-reading-passages/route.js
// Passage selection for READING comprehension — the text analogue of
// get-audio-snippets-codes (listening). For EACH question, find the passage(s)
// in the reading text that justify the answer. Returns verbatim excerpts in the
// order they appear in the text. No audio/indices — reading shows the text.
//
// Input (POST body):
//   { text, questionsAndAnswers: [{ number, question, answer }], maxPassages? }
// Output:
//   { results: [ { number, passages: ["exact substring", ...] }, ... ] }

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

const MAX_PASSAGES = 2;

export const POST = async (req) => {
  try {
    const { text, questionsAndAnswers, maxPassages } = await req.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }
    if (!Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
      return Response.json({ error: "Missing questionsAndAnswers" }, { status: 400 });
    }

    const cap = Number.isInteger(maxPassages) && maxPassages > 0 ? maxPassages : MAX_PASSAGES;

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

    const prompt = `You are an experienced ESL reading teacher.

Below is a reading TEXT and a list of comprehension QUESTIONS with their correct ANSWERS. For EACH question, find the passage(s) in the text that justify the answer — the exact sentence(s) a student should point to as evidence.

Rules:
- A passage is a VERBATIM substring copied EXACTLY from the text — same words, same spelling, no paraphrasing, nothing added or removed.
- Some answers are stated directly; others are IMPLIED and must be inferred. Include the passage(s) a student would rely on to reach the answer, explicit or implied.
- Choose the up-to-${cap} MOST IMPORTANT passages (strongest support), returned in the ORDER THEY APPEAR in the text. Fewer than ${cap} is fine. If NO passage supports the answer, return an empty array for that question.
- Prefer a single complete sentence over a long multi-sentence block when one sentence is enough.

Return ONLY valid JSON — no markdown, no code fences, no other text — an array aligned to the questions, each object shaped exactly:
{"number": <question number>, "passages": ["exact substring from the text", ...]}

TEXT:
${text}

QUESTIONS AND ANSWERS:
${qaList}`;

    // Force valid JSON out of Gemini — verbatim excerpts can carry quotes/
    // newlines that otherwise break a free-text JSON reply.
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    let out = response.text ?? "";
    out = out.replace(/```json\s*|```/g, "").trim();

    let results;
    try {
      results = JSON.parse(out);
    } catch (e) {
      console.error("get-reading-passages JSON parse failed. Raw:", out);
      return Response.json({ error: "Model did not return valid JSON" }, { status: 502 });
    }
    if (!Array.isArray(results)) {
      return Response.json({ error: "Expected an array of results" }, { status: 502 });
    }

    results = results.map((r) => ({
      number: r.number,
      passages: Array.isArray(r.passages) ? r.passages.slice(0, cap) : [],
    }));

    return Response.json({ results }, { status: 200 });
  } catch (error) {
    console.error("get-reading-passages error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
