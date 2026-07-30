// app/api/extract-textbook/route.js
// Extracts structured content from a textbook screenshot using Gemini vision.
// Replaces the Tesseract OCR path in AddTextBook.
//
// Input (POST body): { image, category, mimeType }
//   image    - the screenshot as a base64 string. May be a full data URL
//              ("data:image/png;base64,AAAA...") or just the base64 payload.
//   category - one of the AddTextBook category strings (QuestionText,
//              ListeningQuestionText, AnswerText, ListeningAnswersText,
//              BookText, ListeningTranscript). Selects the prompt fragment.
//   mimeType - optional; e.g. "image/png". Falls back to png, or is read from
//              the data URL if present.
//
// Output: { data } where `data` is the parsed JSON Gemini returned (shape
// depends on category — questions container, or the bookText/transcript shape).
//
// Same Vertex AI + shared service-account auth + GEMINI_MODEL as generate-gist.

import { GoogleGenAI } from "@google/genai";
import { ensureGcpCredentials } from "@app/utils/gcpAuth";
import { buildTextbookPrompt } from "@app/utils/AddTextbookPrompts";

export const POST = async (req) => {
  try {
    const { image, category, mimeType } = await req.json();

    if (!image || image.length === 0) {
      return Response.json({ error: "Missing image" }, { status: 400 });
    }

    // Accept either a full data URL or a bare base64 string.
    let base64 = image;
    let resolvedMime = mimeType || "image/png";
    const dataUrlMatch = /^data:(.+?);base64,(.*)$/s.exec(image);
    if (dataUrlMatch) {
      resolvedMime = dataUrlMatch[1];
      base64 = dataUrlMatch[2];
    }

    // Auth: reuse the shared service-account credentials.
    ensureGcpCredentials();

    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || "us-central1",
    });

    const model = process.env.GEMINI_MODEL;
    const prompt = buildTextbookPrompt(category);

    // Vision request: the prompt text + the image as an inline data part.
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: resolvedMime, data: base64 } },
          ],
        },
      ],
    });

    let text = response.text ?? "";
    text = text.replace(/```json\s*|```/g, "").trim();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("extract-textbook JSON parse failed. Raw:", text);
      return Response.json(
        { error: "Model did not return valid JSON" },
        { status: 502 },
      );
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("extract-textbook error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
