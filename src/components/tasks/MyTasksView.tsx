import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  Sparkles, 
  Lock, 
  Unlock, 
  ArrowRight,
  Shield,
  Check,
  RotateCcw
} from 'lucide-react';
import { HelpRequest, TaskLifecycleState } from '../../types';

export const MyTasksView: React.FC = () => {
  const { 
    currentUser, 
    tasks, 
    verifyTaskOTP, 
    markTaskComplete, 
    confirmTaskCompletion, 
    disputeTask, 
    submitReview,
    setActiveTab,
    setIsSOSModalOpen,
    t,
    language
  } = useApp();

  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingTags, setRatingTags] = useState<string[]>(['Friendly', 'Fast']);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [ratingSubmittedFor, setRatingSubmittedFor] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<'all' | 'active' | 'completed'>('all');

  const availableTags = ['Friendly', 'Fast', 'Professional', 'Helpful', 'Reliable'];

  const userTasks = tasks.filter(t => {
    const isUserTask = t.requesterId === currentUser.id || t.helperId === currentUser.id;
    if (!isUserTask && currentUser.role !== 'admin') return false;

    if (filterState === 'active') {
      return t.state === 'ACCEPTED' || t.state === 'IN_PROGRESS' || t.state === 'HELPER_COMPLETED';
    }
    if (filterState === 'completed') {
      return t.state === 'COMPLETED';
    }
    return true;
  });

  const handleVerifyOTP = async (taskId: string) => {
    if (!otpInput || otpInput.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP');
      return;
    }
    setIsVerifying(true);
    setOtpError(null);

    const result = await verifyTaskOTP(taskId, otpInput);
    setIsVerifying(false);

    if (!result.success) {
      setOtpError(result.error || 'Incorrect OTP. Ask requester for code.');
    } else {
      setOtpInput('');
    }
  };

  const handleRatingSubmit = async (task: HelpRequest) => {
    if (!task.helperId) return;
    await submitReview({
      taskId: task.id,
      taskTitle: task.title,
      helperId: task.helperId,
      rating: ratingStars,
      tags: ratingTags,
      comment: ratingComment || 'Excellent community assistance!',
    });
    setRatingSubmittedFor(task.id);
  };

  const renderTimeline = (state: TaskLifecycleState) => {
    const steps = [
      { key: 'PUBLISHED', label: 'Published' },
      { key: 'ACCEPTED', label: 'Accepted' },
      { key: 'IN_PROGRESS', label: 'In Progress (OTP)' },
      { key: 'HELPER_COMPLETED', label: 'Helper Done' },
      { key: 'COMPLETED', label: 'Paid & Completed' },
    ];

    const getStepIndex = (s: TaskLifecycleState) => {
      switch (s) {
        case 'PUBLISHED': return 0;
        case 'ACCEPTED': return 1;
        case 'IN_PROGRESS': return 2;
        case 'HELPER_COMPLETED': return 3;
        case 'COMPLETED': return 4;
        default: return 0;
      }
    };

    const currentIndex = getStepIndex(state);

    return (
      <div className="w-full py-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#0BB8A8] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isCompleted 
                      ? 'bg-[#0BB8A8] text-white'
                      : isCurrent
                      ? 'bg-[#FF6B2B] text-white ring-4 ring-[#FF6B2B]/20 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-[10px] font-bold mt-1 whitespace-nowrap ${
                  isCurrent ? 'text-[#FF6B2B]' : isCompleted ? 'text-[#0BB8A8]' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.myTasks} & Secure Lifecycle Tracking
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rapido-style 4-digit OTP verification · Escrow release upon requester confirmation
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterState === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterState('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterState === 'active'
                ? 'bg-[#FF6B2B] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Active In-Progress
          </button>
          <button
            onClick={() => setFilterState('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterState === 'completed'
                ? 'bg-[#0BB8A8] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-6">
        {userTasks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">No active tasks in this view</h3>
            <p className="text-xs text-slate-500 mt-1">Post a new request or accept a nearby help task to start.</p>
          </div>
        ) : (
          userTasks.map((task) => {
            const isRequester = task.requesterId === currentUser.id;
            const isHelper = task.helperId === currentUser.id;

            return (
              <div 
                key={task.id}
                className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5"
              >
                {/* Task Header & Escrow Tag */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-orange-500/10 text-xl flex items-center justify-center font-bold">
                      {task.category === 'transport' ? '🚗' : task.category === 'digital' ? '💻' : '💪'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                          {task.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF6B2B]" />
                          {task.location.address}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                        {language === 'ta' && task.titleTamil ? task.titleTamil : task.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#0BB8A8]">₹{task.budget}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                        🛡️ Razorpay Escrow Locked
                      </span>
                    </div>

                    <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase ${
                      task.state === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : task.state === 'IN_PROGRESS'
                        ? 'bg-[#0BB8A8]/10 text-[#0BB8A8] animate-pulse'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {task.state.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* State Machine Step Tracker */}
                {renderTimeline(task.state)}

                {/* Participant Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {/* Requester Profile */}
                  <div className="flex items-center gap-3">
                    <img src={task.requesterAvatar} alt={task.requesterName} className="w-12 h-12 rounded-xl object-cover border" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Requester</span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{task.requesterName}</h4>
                      <p className="text-xs text-slate-500">{task.requesterPhone}</p>
                    </div>
                  </div>

                  {/* Helper Profile */}
                  <div className="flex items-center gap-3">
                    {task.helperName ? (
                      <>
                        <img src={task.helperAvatar} alt={task.helperName} className="w-12 h-12 rounded-xl object-cover border border-[#0BB8A8]" />
                        <div>
                          <span className="text-[10px] font-bold text-[#0BB8A8] uppercase">Accepted Helper</span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>{task.helperName}</span>
                            <span className="text-xs text-amber-500 font-bold">⭐ {task.helperRating}</span>
                          </h4>
                          <p className="text-xs text-slate-500">{task.helperPhone}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 italic">Waiting for a nearby verified helper to accept...</div>
                    )}
                  </div>
                </div>

                {/* RAPIDO-STYLE OTP VERIFICATION SECTION */}
                {task.state === 'ACCEPTED' && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800 dark:to-slate-800/80 p-5 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#FF6B2B]" />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {t.otpRequired} · 4-Digit Secure Verification
                      </h4>
                    </div>

                    {/* Requester View: Show Code */}
                    {isRequester && task.otp && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-slate-700">
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {t.taskStartOTP}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Share this OTP with <span className="font-bold text-slate-800 dark:text-slate-200">{task.helperName}</span> once they arrive at your location.
                          </p>
                        </div>
                        <div className="px-6 py-2 rounded-xl bg-orange-500/10 border border-[#FF6B2B]/30 text-[#FF6B2B] font-mono text-2xl font-black tracking-widest">
                          {task.otp}
                        </div>
                      </div>
                    )}

                    {/* Helper View: Enter Code */}
                    {isHelper && (
                      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {t.askRequesterOTP}
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            maxLength={4}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="4-digit OTP"
                            className="w-40 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl font-mono text-xl font-bold tracking-widest text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0BB8A8]"
                          />
                          <button
                            onClick={() => handleVerifyOTP(task.id)}
                            disabled={isVerifying}
                            className="px-5 py-2.5 rounded-xl bg-[#0BB8A8] hover:bg-[#09998b] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                          >
                            {isVerifying ? (
                              <RotateCcw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                            <span>{t.verifyOTP}</span>
                          </button>
                        </div>

                        {otpError && (
                          <p className="text-xs font-bold text-red-500">{otpError}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* IN PROGRESS TASK CONTROLS & LIVE TRACKING */}
                {task.state === 'IN_PROGRESS' && (
                  <div className="bg-emerald-500/10 dark:bg-emerald-500/15 p-5 rounded-2xl border border-emerald-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        <h4 className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                          {t.taskInProgress} · Live GPS Navigation & Timers Active
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500">Started: {new Date(task.startedAt || Date.now()).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#0BB8A8]" />
                        <span>Chat</span>
                      </button>

                      <a
                        href={`tel:${isRequester ? task.helperPhone : task.requesterPhone}`}
                        className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-500" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => setActiveTab('map')}
                        className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#FF6B2B]" />
                        <span>Navigate (1.2 km · ETA 5m)</span>
                      </button>

                      <button
                        onClick={() => setIsSOSModalOpen(true)}
                        className="px-4 py-2 bg-red-500/10 text-red-600 font-bold text-xs rounded-xl border border-red-500/20 shadow-xs flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        <span>Emergency</span>
                      </button>

                      {/* Helper Completion Button */}
                      {isHelper && (
                        <button
                          onClick={() => markTaskComplete(task.id)}
                          className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{t.markTaskComplete}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* HELPER COMPLETED -> REQUESTER CONFIRMATION MODAL / PANEL */}
                {task.state === 'HELPER_COMPLETED' && (
                  <div className="bg-blue-500/10 dark:bg-blue-500/15 p-5 rounded-2xl border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h4 className="font-extrabold text-sm text-blue-900 dark:text-blue-300">
                          {t.requesterConfirmPrompt}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Payment of <span className="font-bold text-emerald-600">₹{task.budget}</span> is securely held in HelpMate Escrow. Confirming will instantly release funds to {task.helperName}'s wallet.
                    </p>

                    {isRequester ? (
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => confirmTaskCompletion(task.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                        >
                          {t.yesComplete} & Release ₹{task.budget}
                        </button>
                        <button
                          onClick={() => disputeTask(task.id, 'Task was not completed as expected.')}
                          className="px-4 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl transition"
                        >
                          {t.reportProblem}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Waiting for requester ({task.requesterName}) to confirm completion...</p>
                    )}
                  </div>
                )}

                {/* COMPLETED TASK REVIEW & RATING SUBMISSION */}
                {task.state === 'COMPLETED' && ratingSubmittedFor !== task.id && (
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {t.rateYourExperience} with {task.helperName}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">₹{task.budget} Released</span>
                    </div>

                    {/* Star Selector */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRatingStars(star)}
                          className="p-1 hover:scale-125 transition"
                        >
                          <Star className={`w-6 h-6 ${star <= ratingStars ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">{ratingStars} Stars</span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {availableTags.map((tag) => {
                        const isSelected = ratingTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              if (isSelected) setRatingTags(ratingTags.filter(t => t !== tag));
                              else setRatingTags([...ratingTags, tag]);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                              isSelected
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            + {tag}
                          </button>
                        );
                      })}
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="text"
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="Write a short appreciation note..."
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleRatingSubmit(task)}
                        className="px-4 py-2 bg-[#FF6B2B] hover:bg-[#ff5810] text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        {t.submitReview}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
