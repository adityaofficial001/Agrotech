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
  const recentMessages = messages.slice(-15);

  const contextText = `${systemPrompt}\nUser Preferred Language: ${language === 'HI' ? 'Hindi' : 'English'}\n\nChat History:\n` +
    recentMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n') +
    `\nAssistant:`;

  const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: contextText })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from local backend.');
  }

  const data = await response.json();
  const botResponse = data.choices?.[0]?.message?.content;

  if (!botResponse) {
    throw new Error("The AI service returned an empty response.");
  }

  return botResponse;
};
