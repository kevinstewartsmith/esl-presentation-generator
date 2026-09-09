// app/api/rate-difficulty/route.js
// Rates the CEFR difficulty of each detail comprehension question, to help the
// teacher decide which questions are worth reviewing.
//
// Input (POST body): { transcript, questions }
//   transcript - the full listening transcript (the source the answers come from)
//   questions  - array of { question, answer } (the detail comprehension items)
//
// Output: { ratings: [{ level, reason }, ...] }  (index-aligned with questions)
//   level  - a CEFR band: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
//   reason - one short sentence: which factor drove the rating
//
// Same Vertex AI + shared service-account auth + GEMINI_MODEL as generate-gist.

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";
import { buildDifficultyPrompt } from "@app/utils/DifficultyPrompt";

export const POST = async (req) => {
  try {
    const { transcript, questions } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return Response.json({ error: "Missing transcript" }, { status: 400 });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: "Missing questions" }, { status: 400 });
    }

    ensureGcpCredentials();

    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });

    const model = process.env.GEMINI_MODEL;
    const prompt = buildDifficultyPrompt(transcript, questions);

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    let text = response.text ?? "";
    text = text.replace(/```json\s*|```/g, "").trim();

    let ratings;
    try {
      ratings = JSON.parse(text);
    } catch (e) {
      console.error("Difficulty JSON parse failed. Raw:", text);
      return Response.json(
        { error: "Model did not return valid JSON" },
        { status: 502 },
      );
    }

    if (!Array.isArray(ratings)) {
      return Response.json(
        { error: "Expected an array of ratings" },
        { status: 502 },
      );
    }

    return Response.json({ ratings }, { status: 200 });
  } catch (error) {
    console.error("rate-difficulty error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
