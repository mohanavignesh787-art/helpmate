import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Search, 
  Sliders, 
  Sparkles,
  Zap
} from 'lucide-react';
import { User } from '../../types';

export const FindHelpersView: React.FC = () => {
  const { users, currentUser, setActiveTab, t, language, setIsPostModalOpen } = useApp();
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const helpers = users.filter(u => {
    if (skillFilter !== 'all' && !u.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q) || (u.nameTamil && u.nameTamil.toLowerCase().includes(q));
      const matchSkill = u.skills.some(s => s.toLowerCase().includes(q));
      const matchCity = u.location.address.toLowerCase().includes(q);
      if (!matchName && !matchSkill && !matchCity) return false;
    }
    return true;
  });

  const skillsList = ['all', 'Bike Repair', 'Digital Help', 'Electrical', 'Plumbing', 'Carpentry', 'Grocery Delivery', 'Elderly Care'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.findHelpers} & Verified Community Talents
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identity-verified helpers with high community trust scores in Coimbatore
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          Broadcast Request to All
        </button>
      </div>

      {/* Skills Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by helper name, skill (e.g. WiFi, Plumbing) or area..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0BB8A8]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition border ${
                skillFilter === skill
                  ? 'bg-[#0BB8A8] text-white border-[#0BB8A8]'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {skill === 'all' ? 'All Skills' : skill}
            </button>
          ))}
        </div>
      </div>

      {/* Helpers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Top Banner with Avatar & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="relative">
                  <img
                    src={helper.avatar}
                    alt={helper.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                    helper.isHelperModeOn ? 'bg-[#22C55E]' : 'bg-slate-400'
                  }`} />
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    helper.isHelperModeOn
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {helper.isHelperModeOn ? '🟢 AVAILABLE NOW' : '⚫ OFFLINE'}
                  </span>
                  <div className="text-xs font-extrabold text-amber-500 mt-1 flex items-center justify-end gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 inline" />
                    <span>{helper.rating} ({helper.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Name & Bio */}
              <div className="mt-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#0BB8A8] transition">
                    {language === 'ta' && helper.nameTamil ? helper.nameTamil : helper.name}
                  </h3>
                  {helper.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-blue-500" title="Aadhaar & Police Verified" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {helper.bio}
                </p>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tasks</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">120+</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Trust Score</span>
                  <span className="text-xs font-black text-[#0BB8A8]">{helper.trustScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Points</span>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400">{helper.helperPoints}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4 flex items-center gap-1.5 flex-wrap">
                {helper.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-1 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Location */}
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B2B]" />
                <span className="truncate">{helper.location.address}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('messages');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setIsPostModalOpen(true)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                Request Help
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
