// app/api/get-image-stems/route.js
// Image-aware sentence stems: Gemini VISION looks at the chosen image and writes
// recall + speculation stems, graded across the partner's CEFR range. Powers the
// ✦ "Get stem suggestions" button. Same infra (ensureGcpCredentials + GEMINI_MODEL).
//
// The image is a public URL (Unsplash or a pasted link); we fetch its bytes and
// pass them inline as base64 (Vertex inlineData) — works for any public image.
//
// Input:  { imageUrl, cefrMin?, cefrMax?, count? }
// Output: { stems: [ { level, text }, … ] }

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const POST = async (req) => {
  try {
    const { imageUrl, cefrMin = "A2", cefrMax = "B1", count = 4 } =
      await req.json();
    if (!imageUrl) {
      return Response.json({ error: "Missing imageUrl" }, { status: 400 });
    }

    // Fetch the image and inline it as base64.
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return Response.json({ error: "Could not fetch image" }, { status: 502 });
    }
    const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(await imgRes.arrayBuffer()).toString("base64");

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    let lo = LEVELS.indexOf(cefrMin);
    let hi = LEVELS.indexOf(cefrMax);
    if (lo === -1) lo = 1;
    if (hi === -1) hi = 2;
    if (lo > hi) [lo, hi] = [hi, lo];
    const range = LEVELS.slice(lo, hi + 1).join(", ");
    const n = Math.max(1, Math.min(6, parseInt(count, 10) || 4));

    const prompt = `You are an ESL teacher. Look at this image. A student will describe it FROM MEMORY and SPECULATE about it. Write ${n} sentence STEMS (unfinished sentences ending with "…") the student could use — a mix of RECALL ("One thing I remember is …") and SPECULATION (about who the person is, what they're doing, where they are, how they feel, or the job/situation). Ground every stem in what is actually visible in the image. Grade the stems across these CEFR levels: ${range} (spread the difficulty for mixed-ability pairs). Return ONLY a JSON array of objects shaped {"level": "<CEFR level>", "text": "<stem ending in …>"}, no other text.`;

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
    let stems;
    try {
      stems = JSON.parse(text);
    } catch {
      stems = [];
    }
    if (!Array.isArray(stems)) stems = [];
    stems = stems
      .filter((s) => s && typeof s.text === "string")
      .map((s) => ({
        level: LEVELS.includes(s.level) ? s.level : cefrMin,
        text: s.text,
      }))
      .slice(0, n);

    return Response.json({ stems }, { status: 200 });
  } catch (error) {
    console.error("get-image-stems error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
};
