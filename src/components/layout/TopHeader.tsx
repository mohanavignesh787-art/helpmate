import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Wallet, 
  Globe, 
  Sun, 
  Moon, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X,
  ChevronDown,
  LogIn,
  Shield,
  User as UserIcon,
  LogOut
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    currentUser, 
    searchQuery, 
    setSearchQuery, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    t, 
    notifications, 
    markNotificationsRead,
    setIsPostModalOpen,
    setIsAIAssistantOpen,
    setActiveTab,
    toggleHelperMode,
    setIsLoginModalOpen,
    setIsAdminLoginModalOpen,
    isAdminAuthenticated,
    logoutAdmin
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-[70px] frosted-glass backdrop-blur-xl bg-white/80 dark:bg-[#0B0F17]/80 border-b border-slate-200/70 dark:border-slate-800/60 px-6 flex items-center justify-between z-20 shrink-0 select-none transition-colors duration-200">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 transition shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Center / Role Mode Pill Switcher */}
      <div className="hidden lg:flex items-center bg-slate-100/70 dark:bg-slate-800/60 backdrop-blur-md p-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
        <button
          onClick={() => {
            if (currentUser.isHelperModeOn) toggleHelperMode(false);
            setActiveTab('requests');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            !currentUser.isHelperModeOn
              ? 'bg-[#FF6B2B] text-white shadow-sm shadow-[#FF6B2B]/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <span>🙋</span>
          <span>{t.needHelp}</span>
        </button>

        <button
          onClick={() => {
            if (!currentUser.isHelperModeOn) toggleHelperMode(true);
            setActiveTab('map');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentUser.isHelperModeOn
              ? 'bg-[#0BB8A8] text-white shadow-sm shadow-[#0BB8A8]/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <span>💪</span>
          <span>{t.helpOthers}</span>
        </button>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Post Help Request Button */}
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FF6B2B] hover:bg-[#e85b1e] text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{t.postHelpRequest}</span>
        </button>

        {/* HelpMate AI Button */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold text-xs border border-indigo-200/70 dark:border-indigo-500/20 backdrop-blur-md transition hover:scale-[1.02]"
          title="Ask HelpMate AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="hidden md:inline">AI Smart</span>
        </button>

        {/* Login Modal Button */}
        <button
          id="btn-open-user-login-header"
          onClick={() => setIsLoginModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-[#FF6B2B] font-bold text-xs backdrop-blur-md transition"
          title="User Login / Sign In"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Login</span>
        </button>

        {/* Admin Portal Gateway Trigger */}
        <button
          id="btn-open-admin-portal-header"
          onClick={() => {
            if (isAdminAuthenticated) {
              setActiveTab('admin');
            } else {
              setIsAdminLoginModalOpen(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold backdrop-blur-md transition ${
            isAdminAuthenticated
              ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
              : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-red-500'
          }`}
          title="Admin & Verification Portal"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{isAdminAuthenticated ? 'Admin Ops' : 'Admin'}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-xs backdrop-blur-md transition"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 backdrop-blur-md transition"
          title="Toggle Dark / Light Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Wallet Balance Badge */}
        <button
          onClick={() => setActiveTab('wallet')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100/70 border border-teal-200/70 dark:border-teal-500/20 text-[#0BB8A8] font-bold text-xs backdrop-blur-md transition"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>₹{currentUser.wallet.available.toLocaleString()}</span>
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              if (!isNotifOpen) markNotificationsRead();
            }}
            className="p-2 relative rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 backdrop-blur-md transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 frosted-card p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#FF6B2B]" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{t.notifications}</span>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 py-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="py-2.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition">
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {language === 'ta' && n.titleTamil ? n.titleTamil : n.title}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === 'ta' && n.messageTamil ? n.messageTamil : n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    setActiveTab('notifications');
                  }}
                  className="text-xs font-bold text-[#FF6B2B] hover:underline"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl cursor-pointer backdrop-blur-md transition shadow-2xs"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-white dark:border-slate-700 shadow-sm"
            />
            <span 
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                currentUser.isHelperModeOn ? 'bg-[#22C55E]' : 'bg-slate-400'
              }`} 
            />
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {currentUser.isHelperModeOn ? '🟢 Available' : '⚫ Offline'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
