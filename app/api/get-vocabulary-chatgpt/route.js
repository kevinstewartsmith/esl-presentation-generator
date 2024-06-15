import { findVocabularyPrompt } from '@app/utils/prompts';
const axios = require('axios');

export const GET = async (req) => {
    const urlQuery = new URL(req.url)
    const text = urlQuery.searchParams.get("query")
    const cefrLevel = urlQuery.searchParams.get("cefr_level")
    const prompt = findVocabularyPrompt(text, cefrLevel)
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
    console.log("Search query: " + text);
    
    try {
        console.log("fetching");
        const response = await axios.request(options);

        console.log(response.data.choices);

        const results = response.data.choices[0].message.content;
        
        return new Response(results, { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });
    
    } catch (error) {
        console.error(error);
        return new Response(error);
    }
}