import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Navigation, 
  Clock, 
  IndianRupee, 
  MapPin, 
  Star, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Zap,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RapidoTaskOfferModal: React.FC = () => {
  const { incomingTaskPopup, setIncomingTaskPopup, acceptTask, setSelectedTaskForDetail, tasks, setActiveTab } = useApp();
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (!incomingTaskPopup) {
      setSecondsRemaining(15);
      return;
    }

    setSecondsRemaining(incomingTaskPopup.expiresInSeconds || 15);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIncomingTaskPopup(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingTaskPopup, setIncomingTaskPopup]);

  if (!incomingTaskPopup) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptTask(incomingTaskPopup.taskId);
      setIncomingTaskPopup(null);
      // Navigate to live map or detail
      const fullTask = tasks.find(t => t.id === incomingTaskPopup.taskId);
      if (fullTask) {
        setSelectedTaskForDetail(fullTask);
      }
      setActiveTab('map');
    } catch (e) {
      console.error('Accept error:', e);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = () => {
    setIncomingTaskPopup(null);
  };

  // Progress percentage for radial/linear timer
  const progressPercent = ((15 - secondsRemaining) / 15) * 100;

  return (
    <div 
      id="rapido-task-offer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        className="relative w-full max-w-md bg-white dark:bg-[#121824] rounded-3xl shadow-2xl border-2 border-[#FF6B2B]/40 overflow-hidden"
      >
        {/* Radar wave background pulse */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF6B2B]/10 rounded-full animate-ping pointer-events-none" />

        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#FF6B2B] to-[#E85D1E] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-white/90">Nearby Help Request</span>
              <h4 className="text-sm font-bold leading-tight">Instant Match Available!</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDecline}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
          <div 
            className="h-full bg-[#FF6B2B] transition-all duration-1000 ease-linear"
            style={{ width: `${100 - progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Main Price & ETA Grid */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-orange-200/60 dark:border-slate-700">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Guaranteed Pay</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-0.5">
                <span>₹</span>{incomingTaskPopup.budget}
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF6B2B]/15 text-[#FF6B2B] text-xs font-bold">
                <Navigation className="w-3.5 h-3.5" />
                <span>{incomingTaskPopup.distance} km away</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                ETA ~{incomingTaskPopup.etaMinutes} mins
              </div>
            </div>
          </div>

          {/* Task Info */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                {incomingTaskPopup.category}
              </span>
              <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                ⏱️ {secondsRemaining}s to accept
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
              {incomingTaskPopup.title}
            </h3>
          </div>

          {/* Requester & Address Details */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <img 
                src={incomingTaskPopup.requesterAvatar} 
                alt={incomingTaskPopup.requesterName} 
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="truncate">{incomingTaskPopup.requesterName}</span>
                  <div className="flex items-center text-amber-500 text-[11px] shrink-0 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                    {incomingTaskPopup.requesterRating}
                  </div>
                </div>
                <div className="text-slate-400 text-[11px]">Verified Citizen Requester</div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-[#FF6B2B] shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-relaxed">{incomingTaskPopup.address}</span>
            </div>
          </div>

          {/* Action Buttons (Rapido Style) */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              id="btn-decline-task-offer"
              onClick={handleDecline}
              className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Pass / Skip
            </button>

            <button
              type="button"
              id="btn-accept-task-offer"
              onClick={handleAccept}
              disabled={isAccepting}
              className="py-3 px-4 rounded-xl bg-[#0BB8A8] hover:bg-[#099c8e] text-white font-extrabold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 animate-pulse"
            >
              {isAccepting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>ACCEPT ({secondsRemaining}s)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
