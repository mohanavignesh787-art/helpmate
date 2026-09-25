import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Users, 
  CheckCircle2, 
  Radio, 
  FileCheck,
  Zap,
  Info
} from 'lucide-react';

export const SafetyCenterView: React.FC = () => {
  const { currentUser, setIsSOSModalOpen, t, language } = useApp();
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);

  const emergencyContacts = [
    { title: 'Tamil Nadu Police Control Room', number: '100', icon: '👮', desc: 'Direct 24/7 law enforcement assistance' },
    { title: 'Emergency Ambulance Service', number: '108', icon: '🚑', desc: 'Immediate medical & trauma response' },
    { title: 'Women Safety Helpline', number: '1091', icon: '🛡️', desc: 'Dedicated 24/7 women emergency line' },
    { title: 'HelpMate 24/7 Trust & Safety', number: '+91 422 284000', icon: '🤝', desc: 'Platform incident response team' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span>{t.safetyCenter} & Emergency Broadcast</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            24/7 Incident response · Aadhaar Identity Verification · Emergency SOS Dispatch
          </p>
        </div>

        <button
          onClick={() => setIsSOSModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition animate-pulse self-start sm:self-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t.emergencySOS} Broadcast</span>
        </button>
      </div>

      {/* SOS Quick Emergency Card */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white p-6 rounded-3xl shadow-xl shadow-red-600/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase">
              🚨 1-Click Emergency
            </span>
            <span className="text-xs text-white/80">GPS Coordinates Broadcast</span>
          </div>
          <h3 className="text-2xl font-black">
            Are you in an unsafe situation right now?
          </h3>
          <p className="text-xs text-white/90 max-w-xl">
            Pressing SOS triggers instant SMS alerts with your real-time GPS location to the nearest 10 verified community helpers, local police, and your registered emergency contacts.
          </p>
        </div>

        <button
          onClick={() => setIsSOSModalOpen(true)}
          className="px-8 py-4 bg-white text-red-600 hover:bg-slate-100 font-black text-sm rounded-2xl shadow-2xl transition hover:scale-105 active:scale-95 shrink-0 uppercase tracking-wider"
        >
          Trigger SOS Now
        </button>
      </div>

      {/* Emergency Contacts Direct Dial Grid */}
      <div>
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3">
          Instant Emergency Numbers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl">{contact.icon}</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                  {contact.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {contact.desc}
                </p>
              </div>

              <a
                href={`tel:${contact.number}`}
                className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF6B2B] hover:text-white text-slate-800 dark:text-slate-200 font-extrabold text-xs transition group"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#FF6B2B] group-hover:text-white" />
                <span>Call {contact.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Measures & Aadhaar Verification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Community Safety Guidelines */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0BB8A8]" />
            <span>HelpMate Community Safety Guardrails</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="font-bold text-[#FF6B2B]">1.</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">4-Digit Rapido OTP Policy:</span> Never start physical or digital tasks until the helper arrives and validates the 4-digit code.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="font-bold text-[#0BB8A8]">2.</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Escrow Payment Protection:</span> Never pay direct offline cash without releasing escrow in-app. This guarantees refund coverage.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <span className="font-bold text-purple-600">3.</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Public Meeting Points:</span> For first-time physical assistance, prefer well-lit, public community locations.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Aadhaar & Identity Verification Box */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-500" />
              <span>Identity & Trust Verification</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600">
              {currentUser.isVerified ? 'Verified Profile' : 'Pending Verification'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Helpers with verified Government ID receive up to <strong>3.5x more task requests</strong> and priority listing on the Live Map.
          </p>

          <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Aadhaar Card / Voter ID:</span>
              <span className="font-bold text-emerald-600">•••• •••• 9281 (Linked)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Mobile OTP Status:</span>
              <span className="font-bold text-emerald-600">Verified (+91 98401 •••••)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Police Clearance Certificate:</span>
              <span className="font-bold text-blue-600">Active</span>
            </div>
          </div>

          <button
            onClick={() => setVerificationSubmitted(true)}
            className="w-full py-2.5 bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            {verificationSubmitted ? '✓ Credentials Updated' : 'Update Verification Documents'}
          </button>
        </div>
      </div>
    </div>
  );
};
