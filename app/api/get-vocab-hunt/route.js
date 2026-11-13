// app/api/get-vocab-hunt/route.js
// Vocabulary Hunt: given the reading passage, returns the hardest words for the
// target level, sorted HARDEST -> EASIEST, each with the fields the Hunt slide
// shows. Same infra as the other Gemini routes (ensureGcpCredentials + Vertex).
//
// Input:  { text, level?, count? }
// Output: { words: [ { word, pos, ipa, clue, example, paragraph } ] }

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

export const POST = async (req) => {
  try {
    const { text = "", level = "B1", count = 8 } = await req.json();
    if (!text || !text.trim()) {
      return Response.json({ words: [] }, { status: 200 });
    }
    const n = Math.max(1, Math.min(15, parseInt(count, 10) || 8));

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const prompt = `You are an ESL teacher preparing a pre-reading "vocabulary hunt" from a reading text, for ${level} learners.

From the text below, pick the ${n} HARDEST / most useful-to-pre-teach vocabulary items (single words or short fixed phrases). Order them from HARDEST to EASIEST.

For EACH item return:
- "word": the item, lowercase unless a proper noun
- "pos": part of speech, abbreviated (n., v., adj., adv., phr.)
- "ipa": IPA transcription WITH slashes, e.g. /ˌek.strəˈres.tri.əl/
- "clue": a simple one-line definition a ${level} learner would understand (do NOT reuse the word itself)
- "example": one natural sentence using the word (may be adapted from the text)
- "paragraph": the paragraph number where it first appears (count paragraphs from 1)

Return ONLY a JSON array of objects in that order. No prose.

TEXT:
${String(text).slice(0, 8000)}`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let raw = (response.text ?? "").replace(/```json\s*|```/g, "").trim();
    let words;
    try {
      words = JSON.parse(raw);
    } catch {
      words = [];
    }
    if (!Array.isArray(words)) words = [];
    words = words
      .filter((w) => w && typeof w.word === "string" && w.word.trim())
      .map((w) => ({
        word: String(w.word).trim(),
        pos: String(w.pos || "").trim(),
        ipa: String(w.ipa || "").trim(),
        clue: String(w.clue || "").trim(),
        example: String(w.example || "").trim(),
        paragraph: Number(w.paragraph) || null,
      }));

    return Response.json({ words }, { status: 200 });
  } catch (error) {
    console.error("get-vocab-hunt failed", error);
    return Response.json({ error: "Vocab hunt failed" }, { status: 500 });
  }
};
