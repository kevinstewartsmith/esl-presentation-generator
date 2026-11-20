// app/api/generate-dictation-sentences/route.js
// GENERIC running-dictation sentence generator — NOT grammar-only. Produces a
// set of standalone sentences, each demonstrating ONE target item, with the
// exact target substring marked so the PDF can embolden it. The `skill` param
// only decides WHAT the target is:
//   • grammar      → the target grammatical structure is the bolded item
//   • vocabulary   → the target word/phrase is the bolded item
//   • (any other skill can call this the same way)
//
// Input  (POST body):
//   { content, skill, level, count, targets }
//     content : source material (extracted Q&A, a topic, a word list…)
//     skill   : "grammar" | "vocabulary" | …  (default "grammar")
//     level   : CEFR, e.g. "B1" (optional)
//     count   : how many sentences (default 10)
//     targets : optional array of specific items to feature (grammar points or
//               words); if omitted the model infers them from `content`
// Output:
//   { sentences: [ { sentence, target } ] }   target = exact substring to bold

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";

const DEFAULT_COUNT = 10;

function skillFocus(skill) {
  switch ((skill || "").toLowerCase()) {
    case "vocabulary":
    case "vocab":
      return {
        label: "target vocabulary",
        bold: "the target vocabulary word or phrase",
        rule: "Each sentence must naturally use ONE target word/phrase and give enough context to infer its meaning.",
      };
    case "grammar":
    default:
      return {
        label: "target grammar",
        bold: "the words that form the target grammatical structure (e.g. the full verb phrase for a tense)",
        rule: "Each sentence must clearly demonstrate ONE target grammar point in a natural context.",
      };
  }
}

export const POST = async (req) => {
  try {
    const { content, skill, level, count, targets } = await req.json();
    const focus = skillFocus(skill);
    const n = Number.isInteger(count) && count > 0 ? count : DEFAULT_COUNT;
    const lvl = level ? String(level) : "B1";

    if ((!content || !String(content).trim()) && (!Array.isArray(targets) || targets.length === 0)) {
      return Response.json({ error: "Provide content or targets" }, { status: 400 });
    }

    ensureGcpCredentials();
    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = process.env.GEMINI_MODEL;

    const targetBlock = Array.isArray(targets) && targets.length
      ? `Feature these specific items (spread them across the sentences, reuse if fewer than ${n}):\n${targets.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
      : `Infer the ${focus.label} from the SOURCE MATERIAL below and feature it.`;

    const prompt = `You are an experienced ESL teacher creating a RUNNING DICTATION activity for ${lvl} students.

Create exactly ${n} standalone sentences for cut-up strips. Each sentence is posted on a wall; a student reads it, memorises it, and dictates it to a partner.

Requirements:
- ${focus.rule}
- Natural, self-contained sentences appropriate for ${lvl}. 8–16 words each. No numbering, no quotation marks around the whole sentence.
- In each sentence, identify the EXACT substring to embolden: ${focus.bold}. The "target" MUST be copied verbatim from the sentence (same words, same case) so it can be found and bolded.
- Vary the sentences; don't reuse the same frame every time.

${targetBlock}

SOURCE MATERIAL:
${content ? String(content).slice(0, 6000) : "(none — use the target items above)"}

Return ONLY valid JSON — no markdown, no code fences — an array of exactly ${n} objects shaped:
{"sentence": "full sentence", "target": "exact substring to bold"}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    let out = (response.text ?? "").replace(/```json\s*|```/g, "").trim();

    let sentences;
    try {
      sentences = JSON.parse(out);
    } catch (e) {
      console.error("generate-dictation-sentences JSON parse failed. Raw:", out);
      return Response.json({ error: "Model did not return valid JSON" }, { status: 502 });
    }
    if (!Array.isArray(sentences)) {
      return Response.json({ error: "Expected an array" }, { status: 502 });
    }

    // Keep only well-formed items; verify the target really is in the sentence.
    sentences = sentences
      .map((s) => ({ sentence: (s?.sentence || "").trim(), target: (s?.target || "").trim() }))
      .filter((s) => s.sentence)
      .map((s) => (s.target && s.sentence.includes(s.target) ? s : { ...s, target: "" }));

    return Response.json({ sentences }, { status: 200 });
  } catch (error) {
    console.error("generate-dictation-sentences error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
