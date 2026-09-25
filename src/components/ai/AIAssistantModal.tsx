import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  HelpCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ChatItem {
  sender: 'ai' | 'user';
  text: string;
}

export const AIAssistantModal: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, currentUser, language, t } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      sender: 'ai',
      text: language === 'ta'
        ? 'வணக்கம்! நான் HelpMate AI உதவியாளர். உங்களுக்கு பணி மதிப்பீடு, கட்டணம் அல்லது பாதுகாப்பு வழிகாட்டுதலில் எவ்வாறு உதவலாம்?'
        : 'Hello! I am your HelpMate AI Assistant. How can I assist you with task pricing, community guidelines, safety tips, or helper earnings today?'
    }
  ]);

  if (!isAIAssistantOpen) return null;

  const quickPrompts = [
    'How much should I budget for a flat tyre repair?',
    'How does the 4-digit OTP protection work?',
    'What skills are in highest demand for helpers?',
    'Is escrow payment 100% refundable if helper cancels?'
  ];

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || input;
    if (!query.trim() || loading) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, language })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'Here is what I recommend for your community request.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'I am here to help you get tasks done safely and affordably on HelpMate.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col h-[580px] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-orange-500/10 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0BB8A8] to-teal-600 text-white flex items-center justify-center shadow-md shadow-[#0BB8A8]/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>HelpMate AI Assistant</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0BB8A8]/15 text-[#0BB8A8] font-bold">
                  Gemini 2.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Task pricing, safety scoring & helper matching intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-[#0d131f]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#FF6B2B] text-white'
                    : 'bg-[#0BB8A8] text-white'
                }`}
              >
                {m.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#FF6B2B] text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0BB8A8]" />
              <span>HelpMate AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-white dark:bg-[#111827] border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#0BB8A8]/10 hover:text-[#0BB8A8] text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-lg whitespace-nowrap transition border border-slate-200 dark:border-slate-700 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about task fees, helper verification, guidelines..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0BB8A8]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white shadow-md transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
