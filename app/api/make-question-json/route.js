import {
  makeQuestionsArrayPrompt,
  makeAnswersArrayPrompt,
} from "@app/utils/prompts";
const axios = require("axios");

export const POST = async (req) => {
  try {
    const { query, type } = await req.json();

    let prompt;
    if (type === "question") {
      prompt = makeQuestionsArrayPrompt(query);
    } else if (type === "answer") {
      prompt = makeAnswersArrayPrompt(query);
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const options = {
      method: "POST",
      url: process.env.X_RAPID_API_CHAT_GPT_BEST_PRICE_URL,
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.X_RAPID_API_CHAT_GPT_BEST_PRICE_KEY,
        "X-RapidAPI-Host": process.env.X_RAPID_API_HOST,
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
    };

    const response = await axios.request(options);
    const raw = response.data.choices[0].message.content;

    // ChatGPT sometimes wraps JSON in ```json fences — strip before parsing.
    const cleaned = raw.replace(/```json\s*|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed, { status: 200 });
  } catch (error) {
    console.error("make-question-json error:", error);
    return Response.json(
      { error: "Failed to build questions" },
      { status: 500 },
    );
  }
};
