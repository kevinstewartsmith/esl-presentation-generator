import {
  makeQuestionsPrompt,
  makeAnswersPrompt,
  cleanTextPrompt,
} from "@app/utils/prompts";
const axios = require("axios");

export const GET = async (req) => {
  const urlQuery = new URL(req.url);
  const searchQuery = urlQuery.searchParams.get("query");
  const category = urlQuery.searchParams.get("category");
  console.log("CATEGORY: " + category);
  console.log("SEARCH QUERY: " + searchQuery);

  function getPrompt(cat, query) {
    switch (cat) {
      case "BookText":
        return cleanTextPrompt(query);
      case "QuestionText":
        return makeQuestionsPrompt(query);
      case "AnswerText":
        return makeAnswersPrompt(query);
      default:
        return "No category selected";
    }
  }

  console.log("LOGGGGER");
  console.log(getPrompt(category, searchQuery));

  const testText =
    "1 in Mexico / Mexico City 21n 2001, after the attack on the World Trade Center 3 It was the most difficult work they had ever done 4 They only go when local governments and rescue groups cannot manage alone. 5 They offer courses for people who want to become rescue workers.";

  //const prompt = makeAnswersPrompt(testText);
  const prompt = getPrompt(category, searchQuery);
  console.log("PROMPT PROMPT: " + prompt);
  //const prompt = makeQuestionsPrompt(searchQuery);
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
    console.log("CHOICES");
    console.log(response.data.choices);
    const results = response.data.choices[0].message.content;
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(error);
  }
};
