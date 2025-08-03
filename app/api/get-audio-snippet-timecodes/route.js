import { getWordsArrayIndicesPrompt } from "@app/utils/prompts";
import axios from "axios";

export const GET = async (request) => {
  const urlQuery = new URL(request.url);
  const passages = urlQuery.searchParams.get("passages");
  const wordsArray = urlQuery.searchParams.get("wordsarray");

  try {
    const prompt = getWordsArrayIndicesPrompt(passages, wordsArray);
    console.log("Prompt for word array indices:");
    console.log(prompt);

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
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    };

    const response = await axios.request(options);
    const results = response.data.choices[0].message.content;
    console.log("results beginning");
    console.log(results);
    console.log("results end");
    console.log(typeof results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error occurred while fetching audio snippet timecodes:");
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch audio snippet timecodes" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
