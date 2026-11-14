// app/api/get-reading-explanation/route.js
// Answer explanations for READING comprehension — the text twin of
// get-answer-explanation (listening). For EACH question, explain WHY the
// correct answer is correct, grounded in the reading TEXT (and, implicitly, the
// evidence passage). Student-facing, 1–2 sentences. Separate route from passage
// selection so either can be regenerated alone.
//
// Input (POST body):
//   { text, questionsAndAnswers: [{ number, question, answer }, ...] }
// Output:
//   { results: [ { number, explanation }, ... ] }   ("" if it can't be grounded)

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

export const POST = async (req) => {
  try {
    const { text, questionsAndAnswers } = await req.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }
    if (!Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
      return Response.json({ error: "Missing questionsAndAnswers" }, { status: 400 });
    }

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

    const prompt = `You are an experienced ESL reading teacher writing for your students.

Below is a reading TEXT and a list of comprehension QUESTIONS with their correct ANSWERS. For EACH question, explain WHY the answer is correct, using what the text says.

Rules:
- Write 1–2 clear sentences a student could understand. Point to what the text states or implies that leads to the answer.
- Some answers are stated directly; others are IMPLIED. When the answer is inferred, briefly say what the student reasons from ("The text says X, which means...").
- Do not quote long stretches — refer to the relevant part briefly. If the text does not support the answer, return an empty string for that question.

Return ONLY valid JSON — no markdown, no code fences, no other text — an array aligned to the questions, each object shaped exactly:
{"number": <question number>, "explanation": "..."}

TEXT:
${text}

QUESTIONS AND ANSWERS:
${qaList}`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    let out = response.text ?? "";
    out = out.replace(/```json\s*|```/g, "").trim();

    let results;
    try {
      results = JSON.parse(out);
    } catch (e) {
      console.error("get-reading-explanation JSON parse failed. Raw:", out);
      return Response.json({ error: "Model did not return valid JSON" }, { status: 502 });
    }
    if (!Array.isArray(results)) {
      return Response.json({ error: "Expected an array of results" }, { status: 502 });
    }

    results = results.map((r) => ({
      number: r.number,
      explanation: typeof r.explanation === "string" ? r.explanation : "",
    }));

    return Response.json({ results }, { status: 200 });
  } catch (error) {
    console.error("get-reading-explanation error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
