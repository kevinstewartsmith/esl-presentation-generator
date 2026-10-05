// app/api/get-image-keywords/route.js
// Suggests concrete, visual IMAGE-SEARCH keywords from the lesson content, to
// seed the Memory & Speculate image picker. Gemini/Vertex, same infra as
// get-answer-explanation (ensureGcpCredentials + GEMINI_MODEL).
//
// Input:  { transcript?, gist?, questionsAndAnswers? }
// Output: { keywords: ["…", …] }  (up to 8 short strings; [] if no content)

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

export const POST = async (req) => {
  try {
    const { transcript, gist, questionsAndAnswers } = await req.json();

    const parts = [];
    if (transcript) parts.push(`TRANSCRIPT:\n${transcript}`);
    if (gist) {
      parts.push(`GIST: ${typeof gist === "string" ? gist : JSON.stringify(gist)}`);
    }
    if (Array.isArray(questionsAndAnswers) && questionsAndAnswers.length) {
      parts.push(
        "QUESTIONS & ANSWERS:\n" +
          questionsAndAnswers
            .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
            .join("\n"),
      );
    }

    if (parts.length === 0) {
      return Response.json({ keywords: [] }, { status: 200 });
    }

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const prompt = `You are helping an ESL teacher find WARM-UP IMAGES for a lesson. From the lesson content below, suggest 6-8 concrete, VISUAL image-search keywords — things you could actually photograph (people, places, objects, scenes) that capture the lesson's theme. Prefer specific, picturable terms over abstract ideas. Return ONLY a JSON array of short strings, no other text.

LESSON CONTENT:
${parts.join("\n\n")}`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    let text = (response.text ?? "").replace(/```json\s*|```/g, "").trim();

    let keywords;
    try {
      keywords = JSON.parse(text);
    } catch {
      keywords = [];
    }
    if (!Array.isArray(keywords)) keywords = [];
    keywords = keywords.filter((k) => typeof k === "string" && k.trim()).slice(0, 8);

    return Response.json({ keywords }, { status: 200 });
  } catch (error) {
    console.error("get-image-keywords error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
};
