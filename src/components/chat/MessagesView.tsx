import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  Phone, 
  Mic, 
  Paperclip, 
  Image, 
  MapPin, 
  Check, 
  CheckCheck, 
  Lock, 
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { User, ChatMessage } from '../../types';

export const MessagesView: React.FC = () => {
  const { messages, sendMessage, currentUser, users, tasks, t, language } = useApp();

  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(otherUsers[0]?.id || 'user-2');
  const [textInput, setTextInput] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const selectedUser = users.find(u => u.id === selectedRecipientId) || otherUsers[0];

  const quickPrompts = [
    "I'm outside your location 📍",
    "I'll be there in 5 mins ⏳",
    "Can you share the 4-digit OTP? 🔐",
    "Task completed successfully! ✅",
  ];

  const activeThread = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === selectedRecipientId) ||
      (m.senderId === selectedRecipientId && m.recipientId === currentUser.id)
  );

  const handleSend = async (customText?: string) => {
    const text = customText || textInput;
    if (!text.trim()) return;

    await sendMessage(undefined, selectedRecipientId, text, 'text');
    if (!customText) setTextInput('');
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex overflow-hidden animate-in fade-in duration-200">
      {/* Left 35%: Conversations List */}
      <div className="w-[320px] sm:w-[360px] border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {t.messages}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Encrypted in-app messaging</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 space-y-1">
          {otherUsers.map((user) => {
            const isSelected = user.id === selectedRecipientId;
            const lastMsg = messages
              .filter(m => (m.senderId === user.id && m.recipientId === currentUser.id) || (m.senderId === currentUser.id && m.recipientId === user.id))
              .pop();

            return (
              <div
                key={user.id}
                onClick={() => setSelectedRecipientId(user.id)}
                className={`p-3 rounded-2xl cursor-pointer transition flex items-center gap-3 ${
                  isSelected
                    ? 'bg-orange-500/10 dark:bg-orange-500/15 border border-[#FF6B2B]/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border" />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                    user.isHelperModeOn ? 'bg-[#22C55E]' : 'bg-slate-400'
                  }`} />
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : 'Click to start conversation'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 65%: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-[#0D131F]">
        {/* Chat Header */}
        <div className="p-4 bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-xl object-cover border" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {selectedUser.name}
                </h4>
                {selectedUser.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {selectedUser.isHelperModeOn ? '🟢 Online & Available' : '⚫ Offline'} · {selectedUser.location.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${selectedUser.phone}`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 font-bold transition"
              title="Call Contact"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Message Bubble History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeThread.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <p>No messages yet. Send a quick prompt below!</p>
            </div>
          ) : (
            activeThread.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                      isMine
                        ? 'bg-gradient-to-r from-[#FF6B2B] to-[#FF8E53] text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 text-[9px] ${isMine ? 'text-white/80' : 'text-slate-400'}`}>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMine && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white/70 dark:bg-slate-900/70 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#FF6B2B]/10 hover:text-[#FF6B2B] text-slate-600 dark:text-slate-300 text-[11px] font-semibold rounded-full whitespace-nowrap transition border border-slate-200 dark:border-slate-700"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button 
            type="button"
            onClick={() => {
              setIsVoiceRecording(!isVoiceRecording);
              if (!isVoiceRecording) {
                setTimeout(() => {
                  setIsVoiceRecording(false);
                  handleSend("🎙️ Voice Note (0:12) attached");
                }, 2000);
              }
            }}
            className={`p-2 rounded-xl transition ${isVoiceRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800'}`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!textInput.trim()}
            className="p-2.5 rounded-xl bg-[#FF6B2B] hover:bg-[#ff5a14] text-white shadow-md transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
