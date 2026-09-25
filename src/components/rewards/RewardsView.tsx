import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Crown, 
  Medal, 
  Zap, 
  ShieldCheck, 
  Gift, 
  Sparkles, 
  TrendingUp,
  Star
} from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { users, currentUser, t } = useApp();

  const leaderboard = [...users].sort((a, b) => b.helperPoints - a.helperPoints);

  const tiers = [
    { title: 'Bronze Helper', pts: '0 - 250 pts', icon: '🥉', perk: 'Standard map listing' },
    { title: 'Silver Helper', pts: '250 - 750 pts', icon: '🥈', perk: '5% platform fee discount' },
    { title: 'Gold Trusted', pts: '750 - 1500 pts', icon: '🥇', perk: 'Priority dispatch & Verified Gold badge' },
    { title: 'Community Champion', pts: '1500+ pts', icon: '👑', perk: 'Zero commission & VIP support' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            <span>{t.rewards} & Community Champion Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Earn points for timely task completions, 5-star reviews, and helping in emergency situations
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-black text-purple-600 dark:text-purple-400">{currentUser.helperPoints} Points</span>
        </div>
      </div>

      {/* Tiers Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-3xl border transition flex flex-col justify-between ${
              idx === 2
                ? 'bg-gradient-to-br from-purple-500/10 to-amber-500/10 border-purple-500/30 dark:bg-slate-800'
                : 'bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div>
              <span className="text-3xl">{tier.icon}</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2">
                {tier.title}
              </h3>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{tier.pts}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {tier.perk}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              {idx <= 2 ? (
                <span className="text-[10px] font-black uppercase text-emerald-600">✓ Unlocked</span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">Locked (Need 260 more pts)</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Top Helpers of the Month (Coimbatore)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Updated hourly</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {leaderboard.map((user, idx) => (
            <div key={user.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center ${
                  idx === 0
                    ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/30'
                    : idx === 1
                    ? 'bg-slate-300 text-slate-900'
                    : idx === 2
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  #{idx + 1}
                </span>

                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border" />

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </h4>
                  <p className="text-xs text-slate-400">{user.location.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1">
                    <Star className="w-3 h-3 fill-amber-400 inline" />
                    {user.rating}
                  </span>
                  <span className="text-[10px] text-slate-400">{user.reviewCount} Reviews</span>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-purple-600 dark:text-purple-400">
                    {user.helperPoints} pts
                  </span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">Tier 3 Master</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
