import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  MapPin, 
  Clock, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  ArrowUpDown,
  Search
} from 'lucide-react';
import { TaskCategory, HelpRequest } from '../../types';

export const HelpRequestsView: React.FC = () => {
  const { 
    tasks, 
    currentUser, 
    t, 
    language, 
    acceptTask, 
    setIsPostModalOpen, 
    setActiveTab, 
    setSelectedTaskForDetail,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'urgency'>('newest');

  const filteredTasks = tasks.filter((task) => {
    // Filter out completed if only looking for open
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (selectedUrgency !== 'all' && task.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q) || (task.titleTamil && task.titleTamil.toLowerCase().includes(q));
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchLoc = task.location.address.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'budget_high') return b.budget - a.budget;
    if (sortBy === 'urgency') {
      const urgencyRank: Record<string, number> = { immediate: 4, high: 3, medium: 2, low: 1 };
      return (urgencyRank[b.urgency] || 0) - (urgencyRank[a.urgency] || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Tasks', icon: '⚡' },
    { id: 'physical', label: t.categories.physical, icon: '💪' },
    { id: 'digital', label: t.categories.digital, icon: '💻' },
    { id: 'transport', label: t.categories.transport, icon: '🚗' },
    { id: 'food', label: t.categories.food, icon: '🍱' },
    { id: 'repair', label: t.categories.repair, icon: '🛠️' },
    { id: 'household', label: t.categories.household, icon: '🏠' },
    { id: 'emergency', label: t.categories.emergency, icon: '🚨' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.helpRequests} Nearby
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Browse verified community requests within 5 km of Coimbatore
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B2B] hover:bg-[#ff5a14] text-white font-bold text-xs shadow-md shadow-[#FF6B2B]/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.postHelpRequest}</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
              selectedCategory === c.id
                ? 'bg-[#FF6B2B] text-white border-[#FF6B2B] shadow-sm shadow-[#FF6B2B]/25'
                : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-Filters: Sort & Urgency */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Urgency:</span>
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
          >
            <option value="all">All Urgencies</option>
            <option value="immediate">🚨 Immediate</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
          >
            <option value="newest">Recently Posted</option>
            <option value="budget_high">Highest Reward (₹)</option>
            <option value="urgency">Highest Urgency</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">No matching requests found</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching filters or be the first to post a community request.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Category & Urgency Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {task.category}
                    </span>
                    {task.urgency === 'immediate' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 text-red-500">
                        🚨 Immediate
                      </span>
                    ) : task.urgency === 'high' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-500/10 text-orange-600">
                        🟠 High
                      </span>
                    ) : null}
                  </div>

                  <span className="text-base font-black text-[#0BB8A8]">
                    ₹{task.budget}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3 group-hover:text-[#FF6B2B] transition line-clamp-2">
                  {language === 'ta' && task.titleTamil ? task.titleTamil : task.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {task.description}
                </p>

                {/* Location & Preferred Time */}
                <div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B2B] shrink-0" />
                    <span className="truncate">{task.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0BB8A8] shrink-0" />
                    <span>{task.preferredTime || 'Within 1-2 hours'}</span>
                  </div>
                </div>

                {/* AI Safety Tag */}
                {task.aiAnalysis && (
                  <div className="mt-3 py-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Safety Verified ({task.aiAnalysis.safety.replace('_', ' ')})</span>
                  </div>
                )}
              </div>

              {/* Requester Info & Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={task.requesterAvatar}
                    alt={task.requesterName}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate w-24">
                      {task.requesterName}
                    </p>
                    <span className="text-[10px] text-slate-400">⭐ {task.requesterRating}</span>
                  </div>
                </div>

                {task.state === 'PUBLISHED' && currentUser.isHelperModeOn ? (
                  <button
                    onClick={() => acceptTask(task.id)}
                    className="px-4 py-2 bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    {t.acceptTask}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTaskForDetail(task);
                      setActiveTab('tasks');
                    }}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition"
                  >
                    View Status
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
