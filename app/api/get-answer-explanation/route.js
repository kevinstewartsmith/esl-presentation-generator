// app/api/get-answer-explanation/route.js
// Answer explanations for listening comprehension.
//
// For EACH question, explain WHY the correct answer is correct, grounded in the
// transcript — student-facing, 1–2 sentences. Separate AI call from passage
// selection (get-audio-snippets-codes) on purpose: one concern per route, so
// either can be regenerated on its own. Same infra as generate-gist / the
// passage route (Gemini / Vertex AI, GEMINI_MODEL single source of truth,
// ensureGcpCredentials).
//
// Input (POST body):
//   {
//     transcript,                                     // full listening transcript
//     questionsAndAnswers: [{ number, question, answer }, ...]
//   }
//
// Output:
//   { results: [ { number, explanation }, ... ] }
//   - explanation: a short student-facing paragraph; "" if it can't be grounded

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

export const POST = async (req) => {
  try {
    const { transcript, questionsAndAnswers } = await req.json();

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

    const prompt = `You are an experienced ESL listening teacher writing for your students.

Below is a listening TRANSCRIPT and a list of comprehension QUESTIONS with their correct ANSWERS. For EACH question, explain WHY the answer is correct, using what is said in the audio.

Rules:
- Write 1–2 clear sentences a student could understand. Point to what the speaker says or implies that leads to the answer.
- Some answers are stated directly; others are IMPLIED. When the answer is inferred, briefly say what the student reasons from ("Alan says X, which means...").
- Base the explanation ONLY on the transcript — do not invent details that aren't there.
- If the transcript does not actually support the answer, return an empty string for that question's explanation.

Return ONLY valid JSON — no markdown, no code fences, no other text — as an array aligned to the questions, each object shaped exactly:
{"number": <question number>, "explanation": "<1–2 sentences>"}

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
      console.error("Explanation JSON parse failed. Raw:", text);
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

    // Normalize: guarantee each item has number + string explanation.
    results = results.map((r) => ({
      number: r.number,
      explanation: typeof r.explanation === "string" ? r.explanation : "",
    }));

    return Response.json({ results }, { status: 200 });
  } catch (error) {
    console.error("get-answer-explanation error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
