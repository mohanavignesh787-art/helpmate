import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  ThumbsUp, 
  Award, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const ReviewsView: React.FC = () => {
  const { reviews, currentUser, t, language } = useApp();

  const userReviews = reviews.filter(r => r.helperId === currentUser.id || currentUser.role === 'admin');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.reviews} & Community Trust Rating
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified ratings left by community members after successful escrow completion
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          <span className="text-lg font-black text-amber-600 dark:text-amber-400">{currentUser.rating} / 5.0</span>
          <span className="text-xs text-slate-400">({currentUser.reviewCount} Reviews)</span>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Rating Breakdown */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Rating Distribution
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-500">5 Star</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-amber-400 rounded-full" />
              </div>
              <span className="w-8 text-right font-bold">88%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-500">4 Star</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[10%] h-full bg-amber-400 rounded-full" />
              </div>
              <span className="w-8 text-right font-bold">10%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-500">3 Star</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[2%] h-full bg-amber-400 rounded-full" />
              </div>
              <span className="w-8 text-right font-bold">2%</span>
            </div>
          </div>
        </div>

        {/* Top Compliments */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Top Community Badges
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs">
              ⚡ Lightning Fast (34)
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 font-bold text-xs">
              🤝 Highly Helpful (29)
            </span>
            <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 font-bold text-xs">
              🛡️ 100% Reliable (41)
            </span>
            <span className="px-3 py-1 rounded-xl bg-orange-500/10 text-[#FF6B2B] font-bold text-xs">
              💬 Polite & Friendly (38)
            </span>
          </div>
        </div>

        {/* Trust Score Index */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Community Trust Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-4xl font-black text-[#0BB8A8]">
                {currentUser.trustScore}
              </h3>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Calculated via completed tasks, OTP verification speed, and zero dispute flags.
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Recent Testimonials
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={rev.requesterAvatar} alt={rev.requesterName} className="w-10 h-10 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {rev.requesterName}
                    </h4>
                    <p className="text-[11px] text-slate-400">Task: {rev.taskTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 pl-13">
                "{rev.comment}"
              </p>

              <div className="flex items-center gap-1.5 pl-13">
                {rev.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    ✓ {tag}
                  </span>
                ))}
                <span className="text-[10px] text-slate-400 ml-auto">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
