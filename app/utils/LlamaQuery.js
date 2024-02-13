const API_KEY = process.env.DEEP_INFRA_API_KEY;

const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
        model: "meta-llama/Llama-2-70b-chat-hf",
        messages: [{role: "user", content: "Hello"}],
        max_tokens: 20,
    }),
    headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${API_KEY}`,
    }
});
const data = await response.json();

console.log(data.choices[0].message.content);
console.log(data.usage.prompt_tokens, data.usage.completion_tokens);