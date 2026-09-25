import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Wallet, 
  MapPin, 
  Search, 
  Filter, 
  Check, 
  X,
  TrendingUp,
  FileText,
  BadgeCheck,
  Eye,
  History,
  Lock,
  LogOut,
  AlertOctagon,
  Clock,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Navigation
} from 'lucide-react';
import { VerificationStatus, User } from '../../types';

export const AdminPanelView: React.FC = () => {
  const { 
    tasks, 
    users, 
    adminAnalytics, 
    sosAlerts, 
    adminVerificationLogs,
    verifyUserAdmin,
    verifyHelperAdmin,
    confirmTaskCompletion, 
    disputeTask,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    logoutAdmin,
    setSelectedTaskForDetail,
    setActiveTab: setGlobalActiveTab
  } = useApp();

  const [subTab, setSubTab] = useState<'tasks' | 'user_verify' | 'helper_verify' | 'audit_logs' | 'sos'>('user_verify');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedUserDoc, setSelectedUserDoc] = useState<User | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // If not authenticated as Admin, show high-security portal login gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Authentication Required</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            This module contains restricted identity documents, verification pipelines, and financial escrow controls.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-left text-xs space-y-2">
          <div className="font-bold text-slate-700 dark:text-slate-300">Default Operator Credentials:</div>
          <div className="text-slate-600 dark:text-slate-400">Email: <span className="font-mono font-semibold text-[#FF6B2B]">admin@helpmate.org</span></div>
          <div className="text-slate-600 dark:text-slate-400">Password: <span className="font-mono font-semibold text-[#FF6B2B]">admin2026</span></div>
          <div className="text-slate-600 dark:text-slate-400">PIN: <span className="font-mono font-semibold text-[#FF6B2B]">9901</span></div>
        </div>

        <button
          id="btn-trigger-admin-login-view"
          onClick={() => setIsAdminLoginModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-[#FF6B2B] text-white font-bold text-sm shadow-lg hover:shadow-orange-500/25 transition-all"
        >
          Open Admin Login Portal
        </button>
      </div>
    );
  }

  const pendingUserVerifications = users.filter(u => u.userVerificationStatus === 'pending');
  const pendingHelperVerifications = users.filter(u => (u.role === 'helper' || u.isHelperModeOn) && u.helperVerificationStatus === 'pending');

  const handleVerifyUser = async (userId: string, action: 'verify' | 'reject') => {
    setActionInProgress(userId);
    await verifyUserAdmin(userId, action, verificationNote || `Admin ${action}ed user credentials.`);
    setVerificationNote('');
    setActionInProgress(null);
    if (selectedUserDoc?.id === userId) {
      setSelectedUserDoc(null);
    }
  };

  const handleVerifyHelper = async (userId: string, action: 'verify' | 'reject') => {
    setActionInProgress(userId);
    await verifyHelperAdmin(userId, action, verificationNote || `Admin ${action}ed helper status.`);
    setVerificationNote('');
    setActionInProgress(null);
    if (selectedUserDoc?.id === userId) {
      setSelectedUserDoc(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
    u.phone.includes(filterQuery) ||
    u.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              HelpMate Trust & Verification Hub
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full">
              Live Operator
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review identity documents, verify skilled helpers, monitor real-time tasks & audit platform transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-admin-logout"
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>End Admin Session</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Verifications</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {pendingUserVerifications.length + pendingHelperVerifications.length}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {pendingUserVerifications.length} Users · {pendingHelperVerifications.length} Helpers
          </span>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Verified Community</span>
          <p className="text-2xl font-black text-[#0BB8A8] mt-1">
            {users.filter(u => u.userVerificationStatus === 'verified').length}
          </p>
          <span className="text-[11px] text-teal-600 font-semibold">100% Aadhaar/Govt Verified</span>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Active Live Tasks</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {tasks.filter(t => t.state !== 'COMPLETED' && t.state !== 'CANCELLED').length}
          </p>
          <span className="text-[11px] text-[#FF6B2B] font-semibold">Real-time GPS Tracking</span>
        </div>

        <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Escrow Volume Guarded</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            ₹{(adminAnalytics?.totalVolume || 48200).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">0 Disputes Pending</span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          id="tab-admin-user-verify"
          onClick={() => setSubTab('user_verify')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            subTab === 'user_verify' 
              ? 'bg-[#FF6B2B] text-white shadow-sm' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          <span>User Identity Verification ({users.length})</span>
          {pendingUserVerifications.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingUserVerifications.length}
            </span>
          )}
        </button>

        <button
          id="tab-admin-helper-verify"
          onClick={() => setSubTab('helper_verify')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            subTab === 'helper_verify' 
              ? 'bg-[#FF6B2B] text-white shadow-sm' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Helper Skills & Badges</span>
          {pendingHelperVerifications.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingHelperVerifications.length}
            </span>
          )}
        </button>

        <button
          id="tab-admin-tasks"
          onClick={() => setSubTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            subTab === 'tasks' 
              ? 'bg-[#FF6B2B] text-white shadow-sm' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Live Task Monitoring ({tasks.length})</span>
        </button>

        <button
          id="tab-admin-audit-logs"
          onClick={() => setSubTab('audit_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            subTab === 'audit_logs' 
              ? 'bg-[#FF6B2B] text-white shadow-sm' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log Trail ({adminVerificationLogs.length})</span>
        </button>

        <button
          id="tab-admin-sos"
          onClick={() => setSubTab('sos')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            subTab === 'sos' 
              ? 'bg-red-600 text-white shadow-sm' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Emergency SOS ({sosAlerts.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: USER IDENTITY VERIFICATION */}
      {subTab === 'user_verify' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name, phone, email..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredUsers.length} registered citizens & students
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => {
              const status = user.userVerificationStatus || (user.isVerified ? 'verified' : 'pending');
              const docs = user.documents || [];

              return (
                <div 
                  key={user.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {user.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          status === 'verified' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                            : status === 'rejected'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                          {status === 'verified' ? '🟢 Verified Identity' : status === 'rejected' ? '🔴 Rejected' : '🟡 Pending Review'}
                        </span>
                        {user.badges.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                            {b}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                        <span>📱 {user.phone}</span>
                        <span>✉️ {user.email}</span>
                        <span>📍 {user.location.address}</span>
                      </p>

                      {/* Submitted Documents Row */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Submitted Docs:</span>
                        {docs.length > 0 ? (
                          docs.map((doc, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#FF6B2B]" />
                              <span>{doc.type}</span>
                              <span className="text-[10px] text-slate-400">({doc.status})</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No direct doc uploads on file (Phone OTP verified)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedUserDoc(user)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Docs</span>
                    </button>

                    {status !== 'verified' && (
                      <button
                        onClick={() => handleVerifyUser(user.id, 'verify')}
                        disabled={actionInProgress === user.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Approve & Verify</span>
                      </button>
                    )}

                    {status !== 'rejected' && (
                      <button
                        onClick={() => handleVerifyUser(user.id, 'reject')}
                        disabled={actionInProgress === user.id}
                        className="px-3.5 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 text-xs font-bold transition flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: HELPER SKILLS & BADGES */}
      {subTab === 'helper_verify' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/40 text-xs text-teal-800 dark:text-teal-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600 shrink-0" />
              <span>
                <strong>Helper Trust & Skill Assurance:</strong> Helpers with verified trade certificates, background checks, or college IDs receive the <strong>"Verified Helper"</strong> badge and top ranking in smart task matching.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.filter(u => u.role === 'helper' || u.isHelperModeOn).map((helper) => {
              const helperStatus = helper.helperVerificationStatus || 'pending';

              return (
                <div 
                  key={helper.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={helper.avatar} 
                      alt={helper.name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                          {helper.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          helperStatus === 'verified'
                            ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20'
                            : helperStatus === 'rejected'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                          {helperStatus === 'verified' ? '🛡️ Trusted Helper' : helperStatus === 'rejected' ? 'Rejected' : 'Pending Skill Verification'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Completed: {helper.completedTasksCount || 0} tasks · Rating: {helper.rating}★ · Trust: {helper.trustScore}/100
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {helper.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-[11px] font-medium border border-orange-200/50 dark:border-orange-900/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Mode: <strong className={helper.isHelperModeOn ? 'text-teal-600' : 'text-slate-400'}>{helper.isHelperModeOn ? '🟢 Online' : '⚪ Offline'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {helperStatus !== 'verified' && (
                        <button
                          onClick={() => handleVerifyHelper(helper.id, 'verify')}
                          disabled={actionInProgress === helper.id}
                          className="px-3 py-1.5 rounded-xl bg-[#0BB8A8] hover:bg-[#099c8e] text-white text-xs font-bold shadow-sm transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Grant Helper Badge</span>
                        </button>
                      )}

                      {helperStatus === 'verified' && (
                        <button
                          onClick={() => handleVerifyHelper(helper.id, 'reject')}
                          disabled={actionInProgress === helper.id}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold transition"
                        >
                          Revoke Badge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: LIVE TASK MONITORING & ESCROW DISPATCH */}
      {subTab === 'tasks' && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-3 px-2">Task Name</th>
                <th className="py-3 px-2">Requester</th>
                <th className="py-3 px-2">Assigned Helper</th>
                <th className="py-3 px-2">Live State</th>
                <th className="py-3 px-2">Start OTP</th>
                <th className="py-3 px-2">Escrow</th>
                <th className="py-3 px-2 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-2 font-extrabold text-slate-900 dark:text-white">
                    <div>{task.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{task.location.address}</div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                    {task.requesterName}
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 dark:text-slate-300">
                    {task.helperName || <span className="text-amber-500 italic">Matching...</span>}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      task.state === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      task.state === 'IN_PROGRESS' ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 animate-pulse' :
                      task.state === 'STARTED' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {task.state}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {task.startOtp ? (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {task.startOtp}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-3.5 px-2 font-bold text-emerald-600">
                    ₹{task.budget}
                  </td>
                  <td className="py-3.5 px-2 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTaskForDetail(task);
                      }}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold"
                    >
                      View Live Tracker
                    </button>
                    {task.state !== 'COMPLETED' && (
                      <button
                        onClick={() => confirmTaskCompletion(task.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Release Escrow
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 4: AUDIT LOG TRAIL */}
      {subTab === 'audit_logs' && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              <span>Immutable Verification & Compliance Trail</span>
            </h3>
            <span className="text-xs text-slate-400">Total {adminVerificationLogs.length} logged entries</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {adminVerificationLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No audit entries recorded yet.
              </div>
            ) : (
              adminVerificationLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <span>{log.userName}</span>
                      <span className="text-slate-400 font-normal">({log.type.replace('_', ' ')})</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                        log.action === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{log.note}</p>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <div>Operator: <strong>{log.adminName}</strong></div>
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SOS EMERGENCY INCIDENT LOG */}
      {subTab === 'sos' && (
        <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          {sosAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">All Clear! No Open Emergencies</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active SOS signals are broadcasting in the Coimbatore/Tamil Nadu region.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sosAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-6 h-6 text-red-600 animate-bounce" />
                    <div>
                      <div className="font-extrabold text-sm text-red-700 dark:text-red-300">
                        SOS Incident ID: {alert.id}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Location: {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)} · Timestamp: {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs">
                    Dispatch Emergency Response
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document Inspector Modal */}
      {selectedUserDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUserDoc(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <img src={selectedUserDoc.avatar} alt={selectedUserDoc.name} className="w-12 h-12 rounded-2xl object-cover" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedUserDoc.name} — Document Inspection</h3>
                <p className="text-xs text-slate-500">User ID: {selectedUserDoc.id} · Phone: {selectedUserDoc.phone}</p>
              </div>
            </div>

            {/* Document Preview Card */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Government Identity Card Preview</span>
                  <span className="text-[10px] font-bold text-teal-600 uppercase">Encrypted Storage</span>
                </div>
                <div className="h-44 rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-dashed border-slate-400 flex flex-col items-center justify-center p-4 text-center">
                  <FileText className="w-10 h-10 text-slate-400 mb-2" />
                  <div className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    Aadhaar / National ID Document (Masked: XXXX-XXXX-4819)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Verified with UIDAI OTP Gateway
                  </div>
                </div>
              </div>

              {/* Compliance Remark Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Compliance & Verification Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photo matches selfie and ID address verified in Coimbatore."
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2B]"
                />
              </div>

              {/* Decision Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleVerifyUser(selectedUserDoc.id, 'reject')}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-bold text-xs hover:bg-red-100"
                >
                  Reject & Request Resubmission
                </button>
                <button
                  onClick={() => handleVerifyUser(selectedUserDoc.id, 'verify')}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Approve & Grant Verified Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
