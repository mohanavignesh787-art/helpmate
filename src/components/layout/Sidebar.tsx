import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  HelpCircle, 
  MapPin, 
  Users, 
  MessageSquare, 
  ClipboardList, 
  Wallet, 
  Star, 
  Award, 
  ShieldAlert, 
  Bell, 
  User as UserIcon, 
  Settings, 
  Shield, 
  Power, 
  Sparkles,
  AlertTriangle,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { HelperStatus } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    activeTab, 
    setActiveTab, 
    t, 
    language,
    toggleHelperMode, 
    setHelperStatus, 
    notifications,
    setIsSOSModalOpen,
    resetDemoData
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: Home, badge: null },
    { id: 'requests', label: t.helpRequests, icon: HelpCircle, badge: 'New' },
    { id: 'map', label: t.liveMap, icon: MapPin, badge: 'Live' },
    { id: 'helpers', label: t.findHelpers, icon: Users, badge: null },
    { id: 'tasks', label: t.myTasks, icon: ClipboardList, badge: null },
    { id: 'messages', label: t.messages, icon: MessageSquare, badge: null },
    { id: 'wallet', label: t.earnings, icon: Wallet, badge: `₹${currentUser.wallet.available}` },
    { id: 'reviews', label: t.reviews, icon: Star, badge: `${currentUser.rating}★` },
    { id: 'rewards', label: t.rewards, icon: Award, badge: `${currentUser.helperPoints} pts` },
    { id: 'safety', label: t.safetyCenter, icon: ShieldAlert, badge: null },
    { id: 'notifications', label: t.notifications, icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { id: 'profile', label: t.profile, icon: UserIcon, badge: null },
    { id: 'admin', label: t.adminPanel, icon: Shield, badge: 'Ops' },
    { id: 'settings', label: t.settings, icon: Settings, badge: null },
  ];

  return (
    <aside className="w-[260px] h-screen frosted-glass backdrop-blur-xl bg-white/75 dark:bg-[#0B0F17]/85 border-r border-slate-200/70 dark:border-slate-800/60 flex flex-col justify-between shrink-0 z-30 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-[#FF8E53] flex items-center justify-center shadow-lg shadow-[#FF6B2B]/25 text-white font-bold text-xl">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  HelpMate
                </span>
                <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase rounded-md bg-[#0BB8A8]/10 text-[#0BB8A8]">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {language === 'ta' ? 'உதவி இப்போதே' : 'Help Right Now'}
              </p>
            </div>
          </div>

          <button
            onClick={() => resetDemoData()}
            title="Reset Demo Data"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-medium text-xs transition-all duration-150 group ${
                isActive
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF6B2B] font-bold border border-orange-200/70 dark:border-orange-500/20 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#FF6B2B]' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#FF6B2B] text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-red-500 text-white'
                      : item.badge === 'Live'
                      ? 'bg-[#22C55E]/15 text-[#22C55E]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Helper Mode Toggle & User Switcher */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        {/* Helper Mode Card */}
        <div className={`p-3 rounded-2xl border transition-all ${
          currentUser.isHelperModeOn 
            ? 'bg-[#0BB8A8]/10 border-[#0BB8A8]/30 dark:bg-[#0BB8A8]/15' 
            : 'bg-slate-100/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentUser.isHelperModeOn ? 'bg-[#22C55E] animate-pulse' : 'bg-slate-400'}`} />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {t.helperMode}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {currentUser.isHelperModeOn ? t.youAreAvailable : t.youAreOffline}
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => toggleHelperMode()}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                currentUser.isHelperModeOn ? 'bg-[#22C55E]' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  currentUser.isHelperModeOn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {currentUser.isHelperModeOn && (
            <div className="mt-2 pt-2 border-t border-[#0BB8A8]/20 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
              <select
                value={currentUser.helperStatus}
                onChange={(e) => setHelperStatus(e.target.value as HelperStatus)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-[10px] font-semibold text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="available">🟢 Available</option>
                <option value="busy">🟡 Busy</option>
                <option value="away">🟠 Away</option>
                <option value="offline">⚫ Offline</option>
              </select>
            </div>
          )}
        </div>

        {/* User Switcher (Demo Accounts) */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-600 shadow-xs"
            />
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate w-24">
                {language === 'ta' && currentUser.nameTamil ? currentUser.nameTamil : currentUser.name}
              </p>
              <span className="text-[10px] text-slate-500 capitalize">
                {currentUser.role === 'admin' ? '👑 Admin' : currentUser.isHelperModeOn ? '💪 Helper' : '🙋 Seeker'}
              </span>
            </div>
          </div>

          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="text-[11px] font-medium bg-slate-200/70 dark:bg-slate-800/80 border-none rounded-xl px-2 py-1 text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
            title="Switch Demo User"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name.split(' ')[0]} ({u.role === 'admin' ? 'Admin' : u.isHelperModeOn ? 'Helper' : 'Seeker'})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Emergency SOS button */}
        <button
          onClick={() => setIsSOSModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition group"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-bounce" />
          <span>{t.emergencySOS}</span>
        </button>
      </div>
    </aside>
  );
};
