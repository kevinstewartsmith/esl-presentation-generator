// app/api/generate-aims/route.js
// GENERIC lesson-aims / target-language generator — NOT grammar-only. Reads the
// provided content and returns a short list of aims appropriate to drop into a
// lesson plan's "aims / target language" field. The `skill` param flexes the
// wording:
//   • grammar     → name the target structure(s) and what students do with them
//   • vocabulary  → the target lexical set and how it's used
//   • reading/listening/speaking/writing → skill-appropriate aims
//
// Input  (POST body): { content, skill, level }
// Output: { aims: ["...", "..."] }

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

function skillGuidance(skill) {
  switch ((skill || "").toLowerCase()) {
    case "grammar":
      return "Identify the target grammatical structure(s) in the material (there may be one tense/form or several, sometimes mixed). State each as a lesson aim.";
    case "vocabulary":
    case "vocab":
      return "Identify the target vocabulary set and state aims about understanding and using it.";
    case "reading":
      return "State reading sub-skill aims (gist, specific detail, inference) grounded in the material.";
    case "listening":
      return "State listening sub-skill aims (gist, specific detail, inference) grounded in the material.";
    case "speaking":
      return "State speaking/fluency aims grounded in the material.";
    case "writing":
      return "State writing aims (text type, organization, target language) grounded in the material.";
    default:
      return "State concise lesson aims grounded in the material.";
  }
}

export const POST = async (req) => {
  try {
    const { content, skill, level } = await req.json();
    if (!content || !String(content).trim()) {
      return Response.json({ error: "Missing content" }, { status: 400 });
    }
    const lvl = level ? String(level) : "B1";

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const prompt = `You are an experienced ESL teacher writing the AIMS / TARGET LANGUAGE for a ${lvl} lesson plan.

${skillGuidance(skill)}

Rules:
- Return 2–5 concise aims. Each is ONE line, specific and teachable.
- Write them as present-tense base-verb phrases (e.g. "Form and use the past perfect to describe an action before another past action"). Do NOT start a line with "Students".
- Base them strictly on the MATERIAL below. If the material mixes several target points, list each.

Return ONLY valid JSON — no markdown, no code fences — an object:
{"target": "<short label of the target language, e.g. 'Past perfect' or 'Past perfect; reported speech'>", "aims": ["aim one", "aim two", ...]}

MATERIAL:
${String(content).slice(0, 7000)}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    let out = (response.text ?? "").replace(/```json\s*|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch (e) {
      console.error("generate-aims JSON parse failed. Raw:", out);
      return Response.json({ error: "Model did not return valid JSON" }, { status: 502 });
    }
    // Accept { target, aims } (preferred) or a bare array (legacy).
    let aims = Array.isArray(parsed) ? parsed : parsed?.aims;
    const target = Array.isArray(parsed) ? "" : String(parsed?.target || "").trim();
    if (!Array.isArray(aims)) {
      return Response.json({ error: "Expected aims array" }, { status: 502 });
    }
    aims = aims.map((a) => String(a).trim()).filter(Boolean);

    return Response.json({ aims, target }, { status: 200 });
  } catch (error) {
    console.error("generate-aims error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
