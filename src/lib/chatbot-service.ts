export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export const generateChatResponse = async (
  messages: ChatMessage[],
  apiKey: string,
  language: string,
  systemPrompt: string
): Promise<string> => {
  if (!apiKey || apiKey === 'backend') {
    throw new Error('Please configure your Grok API Key in the Chatbot Settings.');
  }

  const langInstruction = language === 'HI' 
    ? "Please provide your response in Hindi language." 
    : "Please provide your response in English language.";

  const endpoint = `https://api.x.ai/v1/chat/completions`;

  // Format messages for OpenAI/Grok API
  const formattedMessages = [
    {
      role: 'system',
      content: systemPrompt + '\n\n' + langInstruction
    },
    ...messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.text
    }))
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: formattedMessages,
      temperature: 0.7,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Grok API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to fetch response from AI service.');
  }

  const data = await response.json();
  const botResponse = data.choices?.[0]?.message?.content;

  if (!botResponse) {
    throw new Error("The AI service returned an empty response.");
  }

  return botResponse;
};
