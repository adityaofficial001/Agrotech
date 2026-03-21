import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Settings, Bot, User, Loader2, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateChatResponse, ChatMessage } from '../lib/chatbot-service';

const SYSTEM_PROMPT = `
You are a helpful, expert agricultural assistant for Vardhman AgriCare (also known as AgriCare Grow Hub). 
Your goal is to help users find suitable farming products, provide agricultural guidance, recommend fertilizers and pesticides based on crop problems, and answer farming-related queries.
Keep your responses concise, polite, and structure them using markdown for readability (e.g., bullet points, bold text).
If you don't know the answer, politely say so. Always respond in the language requested by the user or the language they communicate in.
`;

const SUGGESTIONS = {
  EN: [
    "Best pesticide for rice?",
    "How to increase wheat yield?",
    "Suggest fertilizer for tomato plants"
  ],
  HI: [
    "चावल के लिए सबसे अच्छा कीटनाशक?",
    "गेहूं की पैदावार कैसे बढ़ाएं?",
    "टमाटर के पौधों के लिए उर्वरक सुझाएं"
  ]
};

export function Chatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('backend');
  const [inputApiKey, setInputApiKey] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setInputApiKey(savedKey);
    }
  }, []);

  // Set initial welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([
        { 
          role: 'model', 
          text: language === 'HI' 
            ? 'नमस्ते! मैं आपका कृषि सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?' 
            : 'Hello! I am your agricultural assistant. How can I help you today?',
          timestamp: Date.now() 
        }
      ]);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini_api_key', inputApiKey);
    setApiKey(inputApiKey);
    setIsSettingsOpen(false);
  };

  const handleClearChat = () => {
    setMessages([
        { 
          role: 'model', 
          text: language === 'HI' 
            ? 'बातचीत साफ़ कर दी गई है। मैं आपकी कैसे मदद कर सकता हूँ?' 
            : 'Chat cleared. How can I help you?',
          timestamp: Date.now() 
        }
    ]);
  };

  const processResponse = async (userText: string) => {
    if (!userText.trim() || !apiKey) return;

    const newMessages: ChatMessage[] = [
      ...messages, 
      { role: 'user', text: userText, timestamp: Date.now() }
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(
        newMessages, 
        apiKey, 
        language, 
        SYSTEM_PROMPT
      );
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    } catch (error) {
      console.error('Chatbot API Error:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          text: `Error: ${error instanceof Error ? error.message : 'The AI service is temporarily unavailable.'}`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) return;
    await processResponse(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    processResponse(suggestion);
  };

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(timestamp));
  };

  // Simple Markdown formatter
  const formatText = (text: string) => {
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: safeText.replace(/\n/g, '<br />') };
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all z-50 flex items-center justify-center animate-in zoom-in hover:scale-105"
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  const containerClasses = isExpanded 
    ? "fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[800px] md:h-[600px] bg-background md:rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
    : "fixed bottom-0 right-0 w-full h-[100dvh] md:w-[380px] md:h-[600px] md:bottom-6 md:right-6 bg-background md:rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-200";

  const suggestions = language === 'HI' ? SUGGESTIONS.HI : SUGGESTIONS.EN;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 bg-primary text-primary-foreground shrink-0 shadow-md z-10">
        <div className="flex items-center gap-2">
          <Bot size={22} className="md:w-6 md:h-6" />
          <div>
            <h3 className="font-semibold leading-tight text-sm md:text-base">AgriCare Assistant</h3>
            <span className="text-[10px] md:text-xs text-primary-foreground/80">{language === 'HI' ? 'हिंदी में उपलब्ध' : 'Powered by AI'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          {apiKey && !isSettingsOpen && (
             <button 
              onClick={handleClearChat}
              className="p-1.5 md:p-2 hover:bg-black/10 rounded-full transition-colors flex items-center justify-center"
              title={language === 'HI' ? 'चैट साफ़ करें' : 'Clear Chat'}
           >
             <Trash2 size={16} />
           </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:flex p-1.5 md:p-2 hover:bg-black/10 rounded-full transition-colors items-center justify-center"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-1.5 md:p-2 hover:bg-black/10 rounded-full transition-colors flex items-center justify-center"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 md:p-2 hover:bg-black/10 rounded-full transition-colors flex items-center justify-center ml-1"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-slate-50 relative">
        {isSettingsOpen ? (
          <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <h4 className="font-semibold flex items-center gap-2"><Settings size={18} className="text-primary"/> Configuration</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enter your Gemini API Key to enable the smart assistant. Keys are stored locally in your browser.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">API Key</label>
              <input
                type="password"
                value={inputApiKey}
                onChange={(e) => setInputApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-sm p-2.5 rounded-md border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleSaveApiKey}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm mt-2"
            >
              Save Key & Continue
            </button>
          </div>
        ) : !apiKey ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <Bot size={40} />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">Welcome to AI Assistant</h3>
            <p className="text-sm text-slate-500">Please configure your Gemini API Key to start receiving expert agricultural advice.</p>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="px-6 py-2.5 mt-4 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              Configure Settings
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-2.5 md:gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white border border-slate-200 text-primary'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
                </div>
                <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`p-3 md:p-3.5 rounded-2xl text-[14px] md:text-[15px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-white border border-slate-100 rounded-tl-sm text-slate-800 prose prose-sm prose-p:my-1 prose-strong:text-primary max-w-full overflow-hidden'
                    }`}
                    dangerouslySetInnerHTML={formatText(msg.text)}
                  />
                  <span className="text-[10px] md:text-xs text-slate-400 font-medium px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] self-start animate-in fade-in duration-300">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-slate-200 text-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={18} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[46px]">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Footer */}
      {!isSettingsOpen && apiKey && (
        <div className="bg-white border-t border-slate-200 flex flex-col shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10 shrink-0">
          
          {/* Suggestions */}
          {messages.length <= 2 && !isLoading && (
            <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide border-b border-slate-100 bg-slate-50/50">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium hover:scale-105 hover:border-primary hover:text-primary transition-all shadow-sm flex-shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 md:p-4 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'HI' ? 'अपना प्रश्न पूछें...' : 'Type your question...'}
              className="flex-1 p-3 md:p-3.5 bg-slate-100 focus:bg-white border border-transparent focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-full text-sm outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:bg-primary/95 hover:scale-105 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="translate-x-[1px]" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
