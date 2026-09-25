import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  X, 
  MapPin, 
  PhoneCall, 
  Radio, 
  CheckCircle2, 
  ShieldAlert,
  Loader2
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const { isSOSModalOpen, setIsSOSModalOpen, triggerSOS, currentUser } = useApp();
  const [countdown, setCountdown] = useState<number>(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isSOSModalOpen && !isTriggered && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleInstantDispatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSOSModalOpen, countdown, isTriggered]);

  if (!isSOSModalOpen) return null;

  const handleInstantDispatch = async () => {
    setIsBroadcasting(true);
    await triggerSOS();
    setIsBroadcasting(false);
    setIsTriggered(true);
  };

  const handleClose = () => {
    setIsSOSModalOpen(false);
    setIsTriggered(false);
    setCountdown(5);
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden text-center p-6 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isTriggered ? (
          <>
            <div className="relative flex items-center justify-center mx-auto w-24 h-24">
              <div className="w-24 h-24 rounded-full bg-red-500/20 animate-ping absolute" />
              <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-red-600/40">
                {countdown}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Emergency SOS Triggering
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Broadcasting in <span className="font-bold text-red-600">{countdown} seconds</span> with your live coordinates ({currentUser.location.address}).
              </p>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300">
              🚨 Notifies 10 nearby verified community helpers, Tamil Nadu Police (100), and your family contacts.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl transition"
              >
                Cancel (False Alarm)
              </button>

              <button
                onClick={handleInstantDispatch}
                disabled={isBroadcasting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
              >
                {isBroadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                <span>Send SOS Immediately</span>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-5 py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                SOS Broadcast Dispatched
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help is on the way. Keep your phone on and stay in a secure area.
              </p>
            </div>

            <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Live GPS Location:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.location.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nearby Helpers Alerted:</span>
                <span className="font-bold text-emerald-600">8 Active Helpers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Control Room Response:</span>
                <span className="font-bold text-blue-600">Incident Ticket #SOS-9481</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="tel:100"
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Police (100)</span>
              </a>

              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-extrabold text-xs rounded-xl transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
