import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Mic, 
  Paperclip, 
  Clock, 
  IndianRupee, 
  Send,
  Loader2,
  Check,
  Info
} from 'lucide-react';
import { TaskCategory, TaskUrgency, AIAnalysisResult } from '../../types';

export const PostRequestModal: React.FC = () => {
  const { 
    isPostModalOpen, 
    setIsPostModalOpen, 
    createHelpRequest, 
    analyzeTaskWithAI, 
    currentUser, 
    t, 
    language 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('transport');
  const [budget, setBudget] = useState<number>(120);
  const [urgency, setUrgency] = useState<TaskUrgency>('medium');
  const [locationAddress, setLocationAddress] = useState(currentUser.location.address || 'Gandhipuram, Coimbatore');
  const [preferredTime, setPreferredTime] = useState('Within 1-2 hours');
  const [contactPreference, setContactPreference] = useState<'chat' | 'call' | 'in_person'>('chat');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPostModalOpen) return null;

  const categories: { id: TaskCategory; label: string; icon: string }[] = [
    { id: 'physical', label: t.categories.physical, icon: '💪' },
    { id: 'digital', label: t.categories.digital, icon: '💻' },
    { id: 'transport', label: t.categories.transport, icon: '🚗' },
    { id: 'food', label: t.categories.food, icon: '🍱' },
    { id: 'education', label: t.categories.education, icon: '📚' },
    { id: 'household', label: t.categories.household, icon: '🏠' },
    { id: 'repair', label: t.categories.repair, icon: '🛠️' },
    { id: 'emergency', label: t.categories.emergency, icon: '🚨' },
    { id: 'other', label: t.categories.other, icon: '🤝' },
  ];

  const handleAnalyzeTask = async () => {
    if (!title.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeTaskWithAI({
      title,
      description,
      category,
      budget,
      urgency,
      location: { address: locationAddress, city: 'Coimbatore', lat: 11.0168, lng: 76.9558 }
    });
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handlePublish = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);

    await createHelpRequest({
      title,
      description,
      category,
      budget,
      urgency,
      preferredTime,
      contactPreference,
      location: {
        lat: 11.0168,
        lng: 76.9558,
        address: locationAddress,
        city: 'Coimbatore',
      },
      aiAnalysis: aiAnalysis || undefined,
      state: 'PUBLISHED',
      paymentStatus: 'PAYMENT_AUTHORIZED',
    });

    setIsSubmitting(false);
    setIsPostModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setAiAnalysis(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-slate-800 dark:to-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#FF6B2B] text-white flex items-center justify-center text-lg font-bold">
              ✍️
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {t.postHelpRequest}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI Task Verification · 4-Digit OTP & Razorpay Escrow Protection
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPostModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Push broken bike to nearest workshop, setup WiFi printer..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exact details, landmarks, equipment needed, weight, or specific instructions..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                    category === c.id
                      ? 'bg-[#FF6B2B] text-white border-[#FF6B2B] shadow-sm shadow-[#FF6B2B]/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Urgency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Proposed Helper Payment (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min={50}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Held in secure escrow. Released only after you confirm completion.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as TaskUrgency)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
              >
                <option value="low">🟢 Low (Flexible)</option>
                <option value="medium">🟡 Medium (Today)</option>
                <option value="high">🟠 High (Within 1-2 hrs)</option>
                <option value="immediate">🚨 Immediate (Right Now)</option>
              </select>
            </div>
          </div>

          {/* Location & Preferred Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Location / Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#FF6B2B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#0BB8A8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="e.g. Within 30 mins / 4 PM"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Attachments & Voice Note Simulation */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsVoiceRecording(!isVoiceRecording);
                if (!isVoiceRecording) setTimeout(() => { setIsVoiceRecording(false); setHasVoiceNote(true); }, 2500);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                isVoiceRecording
                  ? 'bg-red-500 text-white animate-pulse border-red-600'
                  : hasVoiceNote
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isVoiceRecording ? 'Recording audio note...' : hasVoiceNote ? 'Voice Note Attached (0:14)' : 'Add Voice Note'}</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Photo attachment simulated for demo')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach Photos</span>
            </button>
          </div>

          {/* AI TASK ANALYZER & SAFETY CHECK BOX */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 p-5 rounded-2xl border border-[#0BB8A8]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0BB8A8]" />
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {t.aiTaskAnalysis} & Safety Guard
                </h4>
              </div>

              <button
                type="button"
                onClick={handleAnalyzeTask}
                disabled={isAnalyzing || !title.trim()}
                className="px-4 py-2 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span>{t.analyzeMyTask}</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                {aiAnalysis.safety === 'HIGH_RISK' || aiAnalysis.validity === 'SUSPICIOUS' ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-red-600 font-extrabold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t.taskNeedsReview}</span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {aiAnalysis.recommendation || 'This task contains potential safety concerns and cannot be published automatically.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.taskValidity}</span>
                        <span className="text-xs font-extrabold text-emerald-600">🟢 {aiAnalysis.validity}</span>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.safetyLevel}</span>
                        <span className="text-xs font-extrabold text-emerald-600">🟢 {aiAnalysis.safety.replace('_', ' ')}</span>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.estimatedDifficulty}</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">⭐⭐ {aiAnalysis.estimatedDifficulty}</span>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t.suggestedBudget}</span>
                        <span className="text-xs font-extrabold text-[#0BB8A8]">₹{aiAnalysis.suggestedBudgetMin}–₹{aiAnalysis.suggestedBudgetMax}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
                      <span className="font-bold text-[#0BB8A8]">AI Recommendation: </span>
                      {aiAnalysis.recommendation}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click <strong>Analyze My Task</strong> to verify realistic pricing, estimated completion duration, and community safety score before broadcasting to nearby helpers.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPostModalOpen(false)}
            className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition"
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting || !title.trim() || aiAnalysis?.safety === 'HIGH_RISK'}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF6B2B] to-[#FF8E53] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#FF6B2B]/25 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{t.publishRequest} (Authorize ₹{budget})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
