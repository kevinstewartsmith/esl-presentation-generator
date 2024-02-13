const axios = require('axios');
import { combinedTranscript } from '@app/utils/transcript';
import { findTrueFalseQuestions } from '@app/utils/prompts';

const prompt = findTrueFalseQuestions(combinedTranscript)

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



export const GET = async (request) => {
    
    try {
        //fetch request using options object
        console.log("fetching");
        const response = await axios.request(options);
        
        return new Response(JSON.stringify(response.data), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error(error);
        return new Response(error);
    }
}