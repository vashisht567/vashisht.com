import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AiAdvisorProps {
  language: Language;
  selectedDomain: string;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({
  language,
  selectedDomain,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text:
        language === 'hindi'
          ? `नमस्ते वशिष्ठ जी! मैं आपका एआई डोमेन एवं गूगल वर्कस्पेस सलाहकार हूँ। डोमेन चयन, कीमत, गूगल वर्कस्पेस सेटअप या व्यावसायिक ईमेल से जुड़े किसी भी सवाल के लिए बेझिझक पूछें!`
          : `Hello Vashisht ji! I am your AI Business Domain & Google Workspace consultant. Feel free to ask any question about selecting your domain, Google Workspace pricing (in INR/USD), DNS configuration, or business email best practices!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          domain: selectedDomain,
          userName: 'Vashisht Joshi',
          conversation: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.answer || 'Maaf kijiye, abhi uttar prapt nahi ho saka.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Advisor error:', err);
      const errorMessage: ChatMessage = {
        id: `m-err-${Date.now()}`,
        role: 'model',
        text: 'Connection me samasya aayi. Kripya punah prayas karein.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    {
      label: 'Google Workspace ka monthly cost kitna hai?',
      query: 'Google Workspace Business Starter ka monthly cost kitna hota hai India me aur kya features milte hain?',
    },
    {
      label: 'Mere liye .com behtar hai ya .in?',
      query: 'Vashisht Joshi ke liye .com domain lena chahiye ya .in domain? Dono me kya farak hai?',
    },
    {
      label: 'Bina website ke sirf email chal sakta hai?',
      query: 'Kya mujhe website banana zaroori hai agar mujhe sirf professional Gmail chahiye?',
    },
    {
      label: 'GST invoice milta hai Google Workspace se?',
      query: 'Kya Google Workspace subscription par input tax credit (GST invoice) claim kiya ja sakta hai?',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'hindi'
                ? 'वशिष्ठ जोशी (Vashisht Joshi) बिजनेस एवं जीमेल सलाहकार'
                : 'AI Business Domain & Gmail Consultant'}
            </h2>
            <p className="text-xs text-slate-500">
              Ask anything in Hindi, Hinglish, or English about your business identity
            </p>
          </div>
        </div>

        {/* Quick Questions Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block mb-2">
            {t.quickQuestions}
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer text-left flex items-center gap-1.5 disabled:opacity-50"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-1">
                    VJ
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                AI
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Vashisht ji ke sawal ka vishleshan ho raha hai...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Poochhein apna sawal (e.g. Domain renew kaise karein?)..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
