// app/api/extract-vocab-from-image/route.js
// Gemini VISION reads a vocabulary screenshot (a coursebook exercise) and pulls
// out the TARGET vocabulary items as a plain list. Powers the Vocabulary Source
// page: on upload the words are extracted so the teacher can review/edit them,
// then they feed Hot Seat's vocab-screenshots source. Same infra as
// get-image-stems (ensureGcpCredentials + GEMINI_MODEL via Vertex).
//
// Input:  { image }  — a data URL (data:image/png;base64,...) or raw base64
// Output: { words: [ "...", ... ] }

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

export const POST = async (req) => {
  try {
    const { image } = await req.json();
    if (!image) {
      return Response.json({ error: "Missing image" }, { status: 400 });
    }

    // Accept a data URL or raw base64.
    let mimeType = "image/png";
    let base64 = image;
    const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s.exec(image);
    if (m) {
      mimeType = m[1];
      base64 = m[2];
    }

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const prompt = `You are an ESL teacher. This is a screenshot from a vocabulary exercise in a coursebook. Extract ONLY the TARGET vocabulary items a student is meant to learn — single words or short fixed phrases. IGNORE instructions, exercise numbers, headings, example sentences, and answer letters (a, b, c). Deduplicate. Return ONLY a JSON array of strings, each a clean vocabulary item, no other text.`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: base64 } },
            { text: prompt },
          ],
        },
      ],
    });

    let text = (response.text ?? "").replace(/```json\s*|```/g, "").trim();
    let words;
    try {
      words = JSON.parse(text);
    } catch {
      words = [];
    }
    if (!Array.isArray(words)) words = [];
    words = words
      .filter((w) => typeof w === "string")
      .map((w) => w.trim())
      .filter(Boolean);
    words = [...new Set(words)]; // dedupe, keep order

    return Response.json({ words }, { status: 200 });
  } catch (error) {
    console.error("extract-vocab-from-image failed", error);
    return Response.json({ error: "Extraction failed" }, { status: 500 });
  }
};
