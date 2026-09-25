import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Globe, 
  Sun, 
  Moon, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, theme, setTheme, t, resetDemoData } = useApp();

  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [razorpayTestMode, setRazorpayTestMode] = useState(true);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.settings} & Platform Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system language, appearance, notifications, and simulated gateways
          </p>
        </div>

        <button
          onClick={() => resetDemoData()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language & Appearance */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#FF6B2B]" />
            <span>Language & Theme</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Language / மொழி
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    language === 'en'
                      ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English (Global)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    language === 'ta'
                      ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>🇮🇳</span>
                  <span>தமிழ் (Tamil)</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Theme</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-white border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Night</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Sound */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0BB8A8]" />
            <span>Alerts & Notifications</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                <p className="text-[10px] text-slate-500">Alerts when nearby tasks are published</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="w-4 h-4 accent-[#0BB8A8]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">SMS Verification Alerts</p>
                <p className="text-[10px] text-slate-500">Receive 4-digit OTP via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#0BB8A8]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Payment Escrow Simulation</p>
                <p className="text-[10px] text-slate-500">Razorpay sandbox test mode enabled</p>
              </div>
              <input
                type="checkbox"
                checked={razorpayTestMode}
                onChange={(e) => setRazorpayTestMode(e.target.checked)}
                className="w-4 h-4 accent-[#0BB8A8]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
