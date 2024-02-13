const axios = require('axios');
import { snippetPrompt } from '@app/utils/prompts';

export const GET = async (request) => {
    const urlQuery = new URL(request.url)
    const questions = urlQuery.searchParams.get("questions")
    const audioData = urlQuery.searchParams.get("audiodata")
    

    try {
      console.log(audioData);
      console.log(questions);
      const prompt = snippetPrompt(questions, audioData)
      console.log(prompt);
        
      const options = {
        method: 'POST',
        url: process.env.X_RAPID_API_CHAT_GPT_BEST_PRICE_URL,
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.X_RAPID_API_CHAT_GPT_BEST_PRICE_KEY,
            'X-RapidAPI-Host': process.env.X_RAPID_API_HOST

          },
          data: {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          }
        };
        
        const response = await axios.request(options);
        const results = response.data.choices[0].message.content;
        console.log("results beginning");
        console.log(results);
        console.log("results end");
        console.log(typeof results);

        return new Response(JSON.stringify(results), { status: 200, headers: { "Content-Type": "application/json" } });
        //return new Response(results, { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.log("Audio snippet error: ", error);
      return new Response("Failed to fetch all prompts", { status: 500 })
    }
}