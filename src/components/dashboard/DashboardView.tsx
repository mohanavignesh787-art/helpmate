import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Clock, 
  Star, 
  Wallet, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  MapPin, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  AlertTriangle,
  ChevronRight,
  Shield
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    tasks, 
    users, 
    t, 
    language, 
    setActiveTab, 
    setIsPostModalOpen, 
    setIsAIAssistantOpen,
    setSelectedTaskForDetail,
    acceptTask
  } = useApp();

  const nearbyRequestsCount = tasks.filter(t => t.state === 'PUBLISHED').length + 21;
  const activeTasks = tasks.filter(t => t.state === 'IN_PROGRESS' || t.state === 'ACCEPTED' || t.state === 'HELPER_COMPLETED');
  const availableHelpers = users.filter(u => u.isHelperModeOn && u.helperStatus === 'available');

  const bestMatchHelper = users.find(u => u.id === 'user-2') || users[1];

  const liveActivities = [
    { id: '1', icon: '🟢', text: 'Kumar accepted a bike-help request', time: '2m ago', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: '2', icon: '💰', text: 'Priya received ₹100 from Arun', time: '5m ago', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
    { id: '3', icon: '⭐', text: 'Arjun received a 5-star rating (Fast & Helpful)', time: '12m ago', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { id: '4', icon: '📍', text: 'New request 0.5 km away: Setup WiFi printer', time: '20m ago', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
    { id: '5', icon: '🆘', text: 'Roadside bike assistance request in Gandhipuram', time: '35m ago', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  ];

  const categories = [
    { id: 'physical', label: t.categories.physical, icon: '💪', count: 8, color: 'from-orange-500 to-amber-500' },
    { id: 'digital', label: t.categories.digital, icon: '💻', count: 6, color: 'from-blue-500 to-cyan-500' },
    { id: 'transport', label: t.categories.transport, icon: '🚗', count: 11, color: 'from-teal-500 to-emerald-500' },
    { id: 'repair', label: t.categories.repair, icon: '🛠️', count: 5, color: 'from-purple-500 to-indigo-500' },
    { id: 'household', label: t.categories.household, icon: '🏠', count: 9, color: 'from-rose-500 to-pink-500' },
    { id: 'emergency', label: t.categories.emergency, icon: '🚨', count: 2, color: 'from-red-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Hero Welcome & Quick Mode Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 frosted-card p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-gradient-to-br from-[#FF6B2B]/15 via-[#0BB8A8]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF6B2B]/10 text-[#FF6B2B] text-xs font-extrabold uppercase tracking-wider border border-[#FF6B2B]/20">
              {currentUser.role === 'admin' ? 'Platform Administrator' : currentUser.isHelperModeOn ? 'Active Helper Mode' : 'Community Seeker'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Coimbatore Central Hub 📍</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {t.greeting}, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.dashboardSubtitle} Connect with people nearby, request help, complete tasks and earn securely.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="bg-[#FF6B2B] hover:bg-[#e85b1e] text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="text-xl leading-none">🙋</span>
            <span>{t.needHelp}</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser.isHelperModeOn) useApp;
              setActiveTab('map');
            }}
            className="bg-white/80 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-slate-700/80 border-2 border-[#0BB8A8] text-[#0BB8A8] dark:text-[#2dd4bf] px-6 py-3.5 rounded-2xl font-bold backdrop-blur-md flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-xl leading-none">💪</span>
            <span>{t.helpOthers}</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Nearby Requests */}
        <div 
          onClick={() => setActiveTab('requests')}
          className="col-span-1 frosted-card p-4 flex flex-col justify-between hover:border-[#FF6B2B]/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Nearby</span>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{nearbyRequestsCount}</div>
            <div className="text-[11px] text-[#FF6B2B] font-bold mt-0.5">Requests Active</div>
          </div>
        </div>

        {/* Tasks Active Now */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="col-span-1 frosted-card p-4 flex flex-col justify-between hover:border-[#0BB8A8]/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Tasks</span>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">0{activeTasks.length || 3}</div>
            <div className="text-[11px] text-[#0BB8A8] font-bold mt-0.5">Active Now</div>
          </div>
        </div>

        {/* Rating */}
        <div 
          onClick={() => setActiveTab('reviews')}
          className="col-span-1 frosted-card p-4 flex flex-col justify-between hover:border-amber-500/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">Rating</span>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1">
              {currentUser.rating} <span className="text-yellow-400 text-lg">★</span>
            </div>
            <div className="text-[11px] text-slate-400 font-bold mt-0.5">Elite Helper</div>
          </div>
        </div>

        {/* Total Earnings Frosted Card */}
        <div className="col-span-2 sm:col-span-3 bg-gradient-to-r from-[#0BB8A8] to-teal-700 p-5 rounded-[28px] relative overflow-hidden flex items-center justify-between shadow-lg shadow-teal-600/20">
          <div className="relative z-10">
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Total Earnings</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">₹{currentUser.wallet.totalEarnings.toLocaleString()}.00</div>
            <div className="text-[10px] text-white/80 mt-1 uppercase tracking-widest font-semibold">Lifetime Revenue · ₹{currentUser.wallet.available} Available</div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('wallet')}
              className="bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2.5 rounded-xl font-bold backdrop-blur-md border border-white/20 transition-colors shadow-xs"
            >
              Withdraw
            </button>
            <button 
              onClick={() => setActiveTab('wallet')}
              className="bg-white hover:bg-slate-100 text-[#0BB8A8] text-xs px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors"
            >
              Details
            </button>
          </div>

          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Active Task In-Progress Highlight Banner (Rapido OTP & Tracking) */}
      {activeTasks.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-lg shadow-teal-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl animate-pulse">
              🚴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-extrabold uppercase">
                  {activeTasks[0].state.replace('_', ' ')}
                </span>
                <span className="text-xs text-white/80">
                  {activeTasks[0].location.address}
                </span>
              </div>
              <h3 className="text-lg font-extrabold mt-0.5">
                {activeTasks[0].title}
              </h3>
              <p className="text-xs text-white/90">
                Helper: <span className="font-bold">{activeTasks[0].helperName}</span> (4.9 ⭐) · Payment Escrow: ₹{activeTasks[0].budget}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTasks[0].otp && activeTasks[0].state === 'ACCEPTED' && (
              <div className="bg-white text-slate-900 px-4 py-2 rounded-2xl font-mono text-center shadow-md">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">START OTP</span>
                <span className="text-xl font-extrabold tracking-widest text-[#FF6B2B]">{activeTasks[0].otp}</span>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedTaskForDetail(activeTasks[0]);
                setActiveTab('tasks');
              }}
              className="px-5 py-3 bg-white text-teal-800 hover:bg-slate-100 font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <span>Open Live Tracker</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Live Radar Map & AI Analyzer + Live Activity Feed & Helpers */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left 8 Cols: Map Radar Preview + AI Analyzer + Categories + Help Requests */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Frosted Glass Live Map Radar Container */}
          <div className="frosted-card p-0 overflow-hidden relative shadow-md flex flex-col min-h-[300px]">
            {/* Dot Matrix Background */}
            <div 
              className="absolute inset-0 opacity-40 dark:opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Top Bar on Map */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="frosted-glass px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold flex items-center gap-2 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B2B] animate-ping" />
                <span>Nearby Radar: Coimbatore, TN</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setActiveTab('map')}
                className="frosted-glass hover:bg-white dark:hover:bg-slate-800 text-xs font-bold px-3.5 py-2 rounded-2xl text-[#0BB8A8] border border-teal-200/60 dark:border-teal-500/30 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Full Interactive Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Radar Center Pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-[#FF6B2B]/20 rounded-full animate-radar flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#FF6B2B] rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>
            </div>

            {/* Simulated Live Markers on Map */}
            <div 
              onClick={() => setActiveTab('requests')}
              className="absolute top-1/2 right-1/4 flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="bg-[#FF6B2B] text-white p-2 rounded-2xl shadow-lg group-hover:scale-110 transition-transform text-xs">
                🆘
              </div>
              <div className="frosted-glass px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-800 dark:text-white shadow-xs border border-white/60 dark:border-slate-700">
                Push Bike (0.4 km)
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('helpers')}
              className="absolute bottom-1/4 left-1/3 flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="bg-[#22C55E] text-white p-2 rounded-2xl shadow-lg group-hover:scale-110 transition-transform text-xs">
                👤
              </div>
              <div className="frosted-glass px-2.5 py-1 rounded-xl text-[10px] font-bold text-[#22C55E] shadow-xs border border-white/60 dark:border-slate-700">
                Kumar M. (3 min away)
              </div>
            </div>

            {/* Map Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('map')}
                className="w-10 h-10 frosted-glass rounded-2xl flex items-center justify-center text-lg font-bold hover:bg-white dark:hover:bg-slate-800 transition shadow-sm"
              >
                +
              </button>
              <button 
                onClick={() => setActiveTab('map')}
                className="w-10 h-10 frosted-glass rounded-2xl flex items-center justify-center text-lg font-bold hover:bg-white dark:hover:bg-slate-800 transition shadow-sm"
              >
                -
              </button>
            </div>
          </div>

          {/* AI Task Analyzer Frosted Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[28px] p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-500/30 p-1.5 rounded-xl text-lg">🤖</span>
                  <h3 className="font-extrabold text-indigo-100 text-base">AI Smart Task Analyzer</h3>
                </div>
                <p className="text-indigo-200/80 text-xs sm:text-sm max-w-md mb-4 leading-relaxed">
                  Ensure your request is safe, realistic, and correctly priced using our real-time smart engine powered by Gemini.
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl backdrop-blur-md">
                    <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Safety Risk</div>
                    <div className="text-lg font-black text-emerald-400">LOW RISK (98/100)</div>
                  </div>
                  <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl backdrop-blur-md">
                    <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Suggested Fair Budget</div>
                    <div className="text-lg font-black text-white">₹150 - ₹200</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPostModalOpen(true)}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/30 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
              >
                Analyze & Post Task
              </button>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Quick Categories Bar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Browse by Category</span>
                <span className="text-xs font-semibold text-slate-400">· 6 Active</span>
              </h3>
              <button 
                onClick={() => setActiveTab('requests')}
                className="text-xs font-bold text-[#FF6B2B] hover:underline flex items-center gap-1"
              >
                <span>View All Requests</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveTab('requests')}
                  className="frosted-card p-3 text-center hover:border-[#FF6B2B]/60 hover:shadow-md transition-all group"
                >
                  <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{c.icon}</div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{c.label}</p>
                  <span className="text-[10px] text-slate-400">{c.count} nearby</span>
                </button>
              ))}
            </div>
          </div>

          {/* Open Help Requests List */}
          <div className="frosted-card p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B2B] animate-ping" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Live Help Requests Nearby
                </h3>
              </div>
              <button 
                onClick={() => setActiveTab('map')}
                className="text-xs font-bold text-[#0BB8A8] hover:underline flex items-center gap-1"
              >
                <span>Open in Live Map 📍</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {tasks.filter(t => t.state === 'PUBLISHED' || t.state === 'ACCEPTED').slice(0, 4).map((task) => (
                <div key={task.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                  <div className="flex items-start gap-3">
                    <img
                      src={task.requesterAvatar}
                      alt={task.requesterName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {task.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF6B2B]" />
                          {task.location.address}
                        </span>
                        {task.urgency === 'immediate' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 text-red-500">
                            🚨 Immediate
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 group-hover:text-[#FF6B2B] transition">
                        {language === 'ta' && task.titleTamil ? task.titleTamil : task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#0BB8A8]">₹{task.budget}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Escrow Ready</span>
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
                        className="px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Activity Feed + Nearby Helpers */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Live Activity Feed */}
          <div className="frosted-card flex flex-col shadow-sm h-[320px] overflow-hidden">
            <div className="p-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-xs flex items-center gap-2">
                <span className="text-base">🔥</span> Live Activity Feed
              </h3>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase font-bold">
                Real-time
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
              <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 p-3 rounded-2xl flex gap-3 items-center">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-lg shrink-0">
                  🚲
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Kumar</span> accepted a bike-help request
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">0.4 km away · 2 mins ago</div>
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 p-3 rounded-2xl flex gap-3 items-center">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-lg shrink-0">
                  💰
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Priya</span> received <span className="text-[#0BB8A8] font-bold">₹100</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Task: Digital Forms · 5 mins ago</div>
                </div>
              </div>

              <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 p-3 rounded-2xl flex gap-3 items-center">
                <div className="w-10 h-10 rounded-2xl bg-yellow-100 dark:bg-yellow-950/60 flex items-center justify-center text-lg shrink-0">
                  ⭐
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Arjun</span> received a 5-star rating
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">"Excellent helper" · 12 mins ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Helpers Card */}
          <div className="frosted-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-xs">
                Nearby Helpers (Mode: ON)
              </h3>
              <span className="text-[10px] text-emerald-500 font-bold">3 Online</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src={bestMatchHelper.avatar} 
                      alt={bestMatchHelper.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{bestMatchHelper.name}</span>
                      <span className="text-[10px] bg-green-50 dark:bg-green-950/60 text-green-600 px-1.5 py-0.5 rounded-md font-bold">
                        4.9★
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Physical Help · 0.4 km
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('helpers')}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-2xs"
                >
                  View
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" 
                      alt="Priya S." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Priya S.</span>
                      <span className="text-[10px] bg-green-50 dark:bg-green-950/60 text-green-600 px-1.5 py-0.5 rounded-md font-bold">
                        4.8★
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Digital Help · 0.8 km
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('helpers')}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-2xs"
                >
                  View
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('helpers')}
              className="w-full py-3 bg-teal-50 dark:bg-teal-950/40 text-[#0BB8A8] text-xs font-bold rounded-2xl border border-teal-100 dark:border-teal-900/60 hover:bg-teal-100/70 transition-colors"
            >
              Browse All Available Helpers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
