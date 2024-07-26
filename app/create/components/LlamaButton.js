// Import the `useState` hook from React
import { useState } from 'react';

const LlamaButton = () => {
  const [response, setResponse] = useState(null);

  const askDeepInfraAssistant = async () => {
    const API_KEY = process.env.DEEP_INFRA_API_KEY;

    try {
      const res = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
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

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <button onClick={askDeepInfraAssistant}>Ask Deep Infra Assistant</button>
      {response && (
        <pre>
          {JSON.stringify(response, null, 2)}
          <br />
          {/* {`Prompt Tokens: ${response.usage.prompt_tokens}, Completion Tokens: ${response.usage.completion_tokens}`} */}
        </pre>
      )}
    </>
  );
};

export default LlamaButton;