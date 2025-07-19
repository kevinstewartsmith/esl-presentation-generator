import {
  makeQuestionsPrompt,
  makeQuestionsArrayPrompt,
  makeAnswersArrayPrompt,
} from "@app/utils/prompts";
const axios = require("axios");

export const GET = async (req) => {
  const urlQuery = new URL(req.url);
  console.log("URL query: " + urlQuery);

  const searchQuery = urlQuery.searchParams.get("query");
  const type = urlQuery.searchParams.get("type");

  let prompt;
  if (type === "question") {
    prompt = makeQuestionsArrayPrompt(searchQuery);
  } else if (type === "answer") {
    prompt = makeAnswersArrayPrompt(searchQuery);
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
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    },
  };
  console.log("Search query: " + searchQuery);

  try {
    //fetch request using options object
    console.log("fetching");
    const response = await axios.request(options);
    //console.log(response.data.choices.messages[0].content);

    console.log(response.data.choices);
    const results = response.data.choices[0].message.content;
    return new Response(results, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(error);
  }
};
