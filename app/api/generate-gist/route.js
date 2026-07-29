// app/api/generate-gist/route.js
// Generates gist (main-idea) question options for a listening/reading text.
//
// Input (POST body): { transcript, detailQuestions }
//   transcript      - the full listening transcript
//   detailQuestions - the already-generated detailed comprehension questions
//                     (so the gist questions stay ZOOMED OUT from the details)
//
// Output: { options: [{ question, answer }, ...] }  (about 5 options)
//
// Uses the Gemini model named by GEMINI_MODEL (single source of truth in
// .env.local), via Vertex AI, authenticated with the shared GCP service
// account (ensureGcpCredentials).

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

export const POST = async (req) => {
  try {
    const { transcript, detailQuestions } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return Response.json({ error: "Missing transcript" }, { status: 400 });
    }

    // Auth: reuse the shared service-account credentials.
    ensureGcpCredentials();

    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });

    const model = process.env.GEMINI_MODEL; // e.g. "gemini-3.1-flash-lite"

    const detailList = Array.isArray(detailQuestions)
      ? detailQuestions.join("\n")
      : detailQuestions || "(none provided)";

    const prompt = `You are an experienced ESL teacher preparing a listening lesson.

Below is a transcript, plus the DETAILED comprehension questions that students will answer later. Your job is to write GIST questions.

A gist question checks GLOBAL understanding — the main idea, overall topic, gist, or speaker's general purpose. It must be answerable after ONE listen without catching specific details. It must be clearly BROADER than the detail questions (do not just restate a detail question).

Write 5 different gist question options. For each, give a short correct answer.

Return ONLY valid JSON — an array of exactly 5 objects, each {"question": "...", "answer": "..."} — with no markdown, no code fences, and no other text.

TRANSCRIPT:
${transcript}

DETAILED QUESTIONS (make your gist questions broader than these):
${detailList}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    let text = response.text ?? "";

    // Strip accidental code fences before parsing.
    text = text.replace(/```json\s*|```/g, "").trim();

    let options;
    try {
      options = JSON.parse(text);
    } catch (e) {
      console.error("Gist JSON parse failed. Raw:", text);
      return Response.json(
        { error: "Model did not return valid JSON" },
        { status: 502 },
      );
    }

    if (!Array.isArray(options)) {
      return Response.json(
        { error: "Expected an array of gist options" },
        { status: 502 },
      );
    }

    return Response.json({ options }, { status: 200 });
  } catch (error) {
    console.error("generate-gist error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
