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
    throw new Error('Please configure your Gemini API Key in the Chatbot Settings.');
  }

  const langInstruction = language === 'HI' 
    ? "Please provide your response in Hindi language." 
    : "Please provide your response in English language.";

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt + '\n\n' + langInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to fetch response from AI service.');
  }

  const data = await response.json();
  const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!botResponse) {
    throw new Error("The AI service returned an empty response.");
  }

  return botResponse;
};
