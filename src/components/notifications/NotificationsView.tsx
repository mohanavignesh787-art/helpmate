import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  Wallet, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationsRead, t, language, setActiveTab } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#FF6B2B]" />
            <span>{t.notifications} & Activity Feed</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time alerts for nearby requests, task status updates, and escrow payouts
          </p>
        </div>

        <button
          onClick={() => markNotificationsRead()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
        >
          <CheckCheck className="w-4 h-4 text-[#0BB8A8]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No notifications available
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`py-4 px-3 rounded-2xl flex items-start justify-between gap-4 transition ${
                  !n.read ? 'bg-orange-500/5 dark:bg-orange-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#FF6B2B] shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {language === 'ta' && n.titleTamil ? n.titleTamil : n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6B2B]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ta' && n.messageTamil ? n.messageTamil : n.message}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
