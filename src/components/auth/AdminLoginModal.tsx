import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Shield, 
  Lock, 
  Mail, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Fingerprint,
  Building2,
  FileCheck2
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminLoginModalOpen, 
    setIsAdminLoginModalOpen, 
    loginAdmin,
    setIsLoginModalOpen
  } = useApp();

  const [email, setEmail] = useState('admin@helpmate.org');
  const [password, setPassword] = useState('admin2026');
  const [adminPin, setAdminPin] = useState('9901');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ok = await loginAdmin(email, password, adminPin);
      if (ok) {
        setIsAdminLoginModalOpen(false);
      } else {
        setError('Invalid admin credentials. Please use the pre-filled demo operator account.');
      }
    } catch (err) {
      setError('Admin verification service error.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@helpmate.org');
    setPassword('admin2026');
    setAdminPin('9901');
    setError(null);
  };

  return (
    <div 
      id="admin-login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden my-auto"
      >
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-500 to-teal-500" />

        {/* Close Button */}
        <button
          id="btn-close-admin-login"
          onClick={() => setIsAdminLoginModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B2B] to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Admin & Operations Portal</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                  Restricted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                HelpMate Trust & Safety, Verification, and Live Task Operations
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Operator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="input-admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@helpmate.org"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B] focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="input-admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B] focus:border-transparent"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2FA Security PIN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="input-admin-pin"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="9901"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white font-mono tracking-widest placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B] focus:border-transparent"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                id="btn-admin-autofill"
                onClick={handleFillDemo}
                className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
              >
                <Key className="w-3.5 h-3.5" />
                Fill Demo Credentials (admin@helpmate.org)
              </button>
            </div>

            <button
              type="submit"
              id="btn-submit-admin-login"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-[#FF6B2B] to-[#FF6B2B] hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authenticate Operator Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Responsibilities Brief */}
          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
            <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <FileCheck2 className="w-4 h-4 mx-auto mb-1 text-teal-400" />
              <span className="text-[11px] block">User & Helper Verification</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <span className="text-[11px] block">Live Dispatch & SOS Monitor</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <span className="text-[11px] block">Escrow Disputes Resolution</span>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Not an operator?</span>
            <button
              type="button"
              id="btn-return-user-login"
              onClick={() => {
                setIsAdminLoginModalOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="text-[#FF6B2B] hover:text-[#ff854f] font-semibold"
            >
              Back to User Login &rarr;
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
