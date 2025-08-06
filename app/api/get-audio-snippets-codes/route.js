const axios = require("axios");
import { snippetPrompt, getPassages } from "@app/utils/prompts";

export const GET = async (request) => {
  const urlQuery = new URL(request.url);
  // const questions = urlQuery.searchParams.get("questions");
  // const audioData = urlQuery.searchParams.get("audiodata");
  // const transcriptStr = urlQuery.searchParams.get("transcript_str");
  // const wordsArray = transcriptStr.split(" ");
  const questionsAndAnswers = urlQuery.searchParams.get("questionsandanswers");
  const transcript = urlQuery.searchParams.get("transcript");
  //console.log(wordsArray);

  try {
    // console.log("AUDIO DATA");
    // console.log(audioData);
    // console.log("QUESTIONS");
    // console.log(questions);
    // console.log("TRANSCRIPT STRING");
    // console.log(transcriptStr);
    // console.log("WORD ARRAY");
    // console.log(wordsArray);
    // const prompt = snippetPrompt(questions, transcriptStr, wordsArray);
    const prompt = getPassages(questionsAndAnswers, transcript);
    console.log("Prompt for audio snippets:");
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
    const parsed = JSON.parse(results);

    return new Response(results, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    //return new Response(results, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.log("Audio snippet error: ", error);
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
