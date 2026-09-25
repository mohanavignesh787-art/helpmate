import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Navigation, 
  CreditCard, 
  Users, 
  ArrowRight,
  Shield,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UserLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginUser, users, switchUser, setIsAdminLoginModalOpen } = useApp();
  
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('helpmate123');
  const [otp, setOtp] = useState(['4', '8', '2', '9']);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = () => {
    if (!identifier) {
      setError('Please enter your mobile number or email.');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await loginUser(identifier, password, otp.join(''));
      if (success) {
        setIsLoginModalOpen(false);
      } else {
        setError('Login failed. Please check your credentials or try a quick demo user.');
      }
    } catch (err) {
      setError('Network error during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    setIsLoginModalOpen(false);
  };

  return (
    <div 
      id="user-login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-white dark:bg-[#121824] rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-login-modal"
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Hero Graphic Section */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FF6B2B] via-[#E85D1E] to-[#0BB8A8] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background ambient pattern */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

            {/* Brand Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
                  🤝
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white leading-tight">HelpMate</h2>
                  <p className="text-xs text-white/80 font-medium">Help Right Now · உதவி இப்போதே</p>
                </div>
              </div>
              <p className="text-sm text-white/90 font-medium mt-3">
                Get Help. Give Help. Earn Together.
              </p>
            </div>

            {/* Visual Value Cards */}
            <div className="space-y-3 my-6 relative z-10">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">100% Verified Community</div>
                  <div className="text-white/75 text-[11px]">Govt ID & Skill checked helpers</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Rapido-Style Live Tracking</div>
                  <div className="text-white/75 text-[11px]">Real-time GPS + 4-digit start OTP</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Instant Escrow Payouts</div>
                  <div className="text-white/75 text-[11px]">Zero delay UPI direct withdrawals</div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="relative z-10 pt-4 border-t border-white/20 text-[11px] text-white/80 flex items-center justify-between">
              <span>Coimbatore · Chennai · Madurai</span>
              <span className="font-semibold text-white">Tamil & English</span>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#121824]">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Welcome to HelpMate <span className="inline-block animate-bounce">👋</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your mobile number or email to log in or register instantly.
                </p>
              </div>

              {/* Login Method Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-5 max-w-xs">
                <button
                  type="button"
                  id="tab-login-otp"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    loginMethod === 'otp'
                      ? 'bg-white dark:bg-slate-700 text-[#FF6B2B] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Quick OTP
                </button>
                <button
                  type="button"
                  id="tab-login-password"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    loginMethod === 'password'
                      ? 'bg-white dark:bg-slate-700 text-[#FF6B2B] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Password
                </button>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="input-login-identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or arun@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 focus:border-[#FF6B2B]"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {loginMethod === 'password' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="input-login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]/40 focus:border-[#FF6B2B]"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}

                {loginMethod === 'otp' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        4-Digit Verification OTP
                      </label>
                      {!otpSent ? (
                        <button
                          type="button"
                          id="btn-send-otp"
                          onClick={handleSendOtp}
                          className="text-xs font-semibold text-[#FF6B2B] hover:text-[#e05819]"
                        >
                          Send OTP
                        </button>
                      ) : (
                        <span className="text-[11px] text-teal-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> OTP Sent (4829)
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 sm:gap-3 justify-between max-w-xs">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-12 h-12 text-center text-lg font-bold bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-submit-user-login"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B2B] to-[#E85D1E] hover:from-[#e5591c] hover:to-[#d04e12] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue to HelpMate</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Fast Login Switcher */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    ⚡ Quick Demo Login:
                  </span>
                  <span className="text-[11px] text-slate-400">Click to switch instantly</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {users.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      id={`btn-demo-login-${u.id}`}
                      onClick={() => handleQuickLogin(u.id)}
                      className="p-2 text-left rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-all flex items-center gap-2"
                    >
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-500 capitalize truncate">
                          {u.role === 'helper' ? '🛠️ Helper' : u.role === 'admin' ? '🛡️ Admin' : '👤 Requester'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Portal Shortcut Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Are you a platform operator?</span>
              <button
                type="button"
                id="btn-switch-to-admin-login"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsAdminLoginModalOpen(true);
                }}
                className="font-bold text-[#0BB8A8] hover:text-[#099c8e] flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Portal Login &rarr;
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
