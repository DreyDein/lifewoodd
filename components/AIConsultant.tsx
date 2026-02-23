
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AIConsultantProps {
  t: any;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: t.greeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      // Initialize inside the function to ensure the most up-to-date API key is used
      // and to avoid issues with early script execution.
      const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: 'You are a professional AI Consultant for Lifewood, a global provider of data services. Your goal is to answer questions about Lifewood\'s services (Audio, Image, Video, Text processing) and explain how AI data labeling and collection can help businesses. Keep your answers concise, professional, and helpful. If asked about pricing or specific quotes, encourage the user to reach out to the sales team at contact@lifewood.com.',
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple chat
        },
      });

      const aiText = response.text || t.fallbackResponse;
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      let friendlyError = t.connectionError;
      
      // Check if it's an API Key issue (often results in a 403 or 401)
      if (error instanceof Error && (error.message.includes("403") || error.message.includes("401") || error.message.includes("key"))) {
        friendlyError = t.credentialsError;
      }

      setMessages(prev => [...prev, { role: 'ai', text: friendlyError }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="bg-lifewood-white w-80 md:w-96 h-[500px] shadow-2xl rounded-2xl flex flex-col border border-lifewood-paper overflow-hidden dark:bg-lifewood-dark dark:border-lifewood-green/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-lifewood-green p-4 flex justify-between items-center text-lifewood-white shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lifewood-saffron rounded-full flex items-center justify-center text-lifewood-dark shadow-inner text-xl">
                🤖
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">{t.headerTitle}</div>
                <div className="text-[10px] opacity-80 uppercase tracking-widest font-bold">{t.headerSubtitle}</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-lifewood-seaSalt dark:bg-lifewood-dark/90">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-lifewood-green text-lifewood-white rounded-tr-none' 
                    : 'bg-lifewood-white text-lifewood-dark border border-lifewood-paper rounded-tl-none dark:bg-lifewood-dark dark:text-lifewood-seaSalt dark:border-lifewood-green/20'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-lifewood-white p-3 px-4 rounded-2xl text-[14px] shadow-sm border border-lifewood-paper rounded-tl-none dark:bg-lifewood-dark dark:text-lifewood-seaSalt dark:border-lifewood-green/20">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-lifewood-green/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-lifewood-green/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-lifewood-green/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-lifewood-paper dark:border-lifewood-green/20 bg-lifewood-white dark:bg-lifewood-dark">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                disabled={isTyping}
                className="w-full bg-lifewood-seaSalt dark:bg-lifewood-dark/50 border border-lifewood-paper dark:border-lifewood-green/30 rounded-full pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-lifewood-green focus:border-transparent outline-none dark:text-lifewood-seaSalt transition-all disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 bg-lifewood-green text-lifewood-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-lifewood-dark transition-all active:scale-90 disabled:opacity-50 disabled:hover:bg-lifewood-green"
              >
                <svg className="w-5 h-5 rotate-45 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-lifewood-green text-lifewood-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-lifewood-dark transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-lifewood-saffron/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="text-3xl group-hover:scale-110 transition-transform relative z-10">🤖</div>
        </button>
      )}
    </div>
  );
};

export default AIConsultant;
