import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, HelpRequest, ChatMessage, NotificationItem, WalletTransaction, Review, SOSAlert, AdminAnalytics, AIAnalysisResult, HelperStatus } from '../types';
import { Language, translations } from '../i18n/translations';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  users: User[];
  tasks: HelpRequest[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  transactions: WalletTransaction[];
  reviews: Review[];
  sosAlerts: SOSAlert[];
  adminAnalytics: AdminAnalytics | null;
  adminVerificationLogs: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isSOSModalOpen: boolean;
  setIsSOSModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  selectedTaskForDetail: HelpRequest | null;
  setSelectedTaskForDetail: (task: HelpRequest | null) => void;
  incomingTaskPopup: any | null;
  setIncomingTaskPopup: (popup: any | null) => void;
  googleMapsApiKey: string;
  googleMapsConfigured: boolean;
  
  // Actions
  switchUser: (userId: string) => void;
  loginUser: (identifier: string, password?: string, otp?: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string, otp?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  toggleHelperMode: (val?: boolean) => Promise<void>;
  setHelperStatus: (status: HelperStatus) => Promise<void>;
  createHelpRequest: (taskData: Partial<HelpRequest>) => Promise<HelpRequest>;
  analyzeTaskWithAI: (taskData: any) => Promise<AIAnalysisResult>;
  acceptTask: (taskId: string) => Promise<void>;
  verifyTaskOTP: (taskId: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  markTaskComplete: (taskId: string) => Promise<void>;
  confirmTaskCompletion: (taskId: string) => Promise<void>;
  disputeTask: (taskId: string, reason: string) => Promise<void>;
  sendMessage: (taskId: string | undefined, recipientId: string, text: string, type?: any) => Promise<void>;
  withdrawEarnings: (amount: number, method: 'upi' | 'bank_account', accountDetails: string) => Promise<boolean>;
  submitReview: (reviewData: Partial<Review>) => Promise<void>;
  triggerSOS: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  verifyUserAdmin: (userId: string, action: 'verify' | 'reject', note?: string) => Promise<void>;
  verifyHelperAdmin: (userId: string, action: 'verify' | 'reject', note?: string) => Promise<void>;
  matchHelpersForTask: (taskLocation: any, category: string, urgency: string) => Promise<{ bestMatch: any; rankedHelpers: any[] }>;
  resetDemoData: () => Promise<void>;
  fetchFreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<HelpRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<AdminAnalytics | null>(null);
  const [adminVerificationLogs, setAdminVerificationLogs] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<HelpRequest | null>(null);
  const [incomingTaskPopup, setIncomingTaskPopup] = useState<any | null>(null);

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');
  const [googleMapsConfigured, setGoogleMapsConfigured] = useState<boolean>(false);

  const t = translations[language];

  // Theme synchronization
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('helpmate_theme', newTheme);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('helpmate_lang', lang);
  };

  const fetchFreshData = useCallback(async () => {
    try {
      const [usersRes, tasksRes, msgRes, notifRes, txnRes, revRes, adminRes, configRes, auditRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/tasks'),
        fetch('/api/messages'),
        fetch('/api/notifications'),
        fetch('/api/transactions'),
        fetch('/api/reviews'),
        fetch('/api/admin/analytics'),
        fetch('/api/config'),
        fetch('/api/admin/verification-logs')
      ]);

      const [usersData, tasksData, msgData, notifData, txnData, revData, adminData, configData, auditData] = await Promise.all([
        usersRes.json(),
        tasksRes.json(),
        msgRes.json(),
        notifRes.json(),
        txnRes.json(),
        revRes.json(),
        adminRes.json(),
        configRes.json(),
        auditRes.json()
      ]);

      setUsers(usersData);
      setTasks(tasksData);
      setMessages(msgData);
      setNotifications(notifData);
      setTransactions(txnData);
      setReviews(revData);
      setAdminAnalytics(adminData);
      setAdminVerificationLogs(auditData || []);

      if (configData) {
        setGoogleMapsApiKey(configData.googleMapsApiKey || '');
        setGoogleMapsConfigured(Boolean(configData.googleMapsConfigured));
      }

      if (!currentUser && usersData.length > 0) {
        // Default to Arun Kumar (User 1)
        setCurrentUser(usersData[0]);
      } else if (currentUser) {
        const updated = usersData.find((u: User) => u.id === currentUser.id);
        if (updated) setCurrentUser(updated);
      }
    } catch (e) {
      console.error('Failed to fetch HelpMate data:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('helpmate_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedLang = localStorage.getItem('helpmate_lang') as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
    if (sessionStorage.getItem('helpmate_admin_auth') === 'true') {
      setIsAdminAuthenticated(true);
    }

    fetchFreshData();
    const interval = setInterval(fetchFreshData, 6000);
    return () => clearInterval(interval);
  }, []);

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const toggleHelperMode = async (val?: boolean) => {
    if (!currentUser) return;
    const nextVal = typeof val === 'boolean' ? val : !currentUser.isHelperModeOn;
    const nextStatus: HelperStatus = nextVal ? 'available' : 'offline';

    try {
      const res = await fetch(`/api/users/${currentUser.id}/helper-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHelperModeOn: nextVal, helperStatus: nextStatus })
      });
      const updated = await res.json();
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch (e) {
      console.error(e);
    }
  };

  const setHelperStatus = async (status: HelperStatus) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}/helper-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHelperModeOn: status !== 'offline', helperStatus: status })
      });
      const updated = await res.json();
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch (e) {
      console.error(e);
    }
  };

  const analyzeTaskWithAI = async (taskData: any): Promise<AIAnalysisResult> => {
    try {
      const res = await fetch('/api/tasks/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      return await res.json();
    } catch (e) {
      return {
        validity: 'GOOD',
        safety: 'LOW_RISK',
        estimatedDifficulty: 'Easy',
        estimatedTime: '20–30 minutes',
        suggestedBudgetMin: 80,
        suggestedBudgetMax: 150,
        confidenceScore: 90,
        recommendation: 'Task meets community guidelines.'
      };
    }
  };

  const createHelpRequest = async (taskData: Partial<HelpRequest>): Promise<HelpRequest> => {
    if (!currentUser) throw new Error("Not logged in");
    const payload = {
      ...taskData,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      requesterRating: currentUser.rating,
      requesterPhone: currentUser.phone,
      location: taskData.location || currentUser.location,
    };

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const newTask = await res.json();
    setTasks(prev => [newTask, ...prev]);
    fetchFreshData();
    return newTask;
  };

  const acceptTask = async (taskId: string) => {
    if (!currentUser) return;
    const res = await fetch(`/api/tasks/${taskId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        helperId: currentUser.id,
        helperName: currentUser.name,
        helperAvatar: currentUser.avatar,
        helperRating: currentUser.rating,
        helperPhone: currentUser.phone,
      })
    });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    fetchFreshData();
  };

  const verifyTaskOTP = async (taskId: string, otp: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
        fetchFreshData();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid OTP' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification failed' };
    }
  };

  const markTaskComplete = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    fetchFreshData();
  };

  const confirmTaskCompletion = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}/confirm-complete`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
      fetchFreshData();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }
  };

  const disputeTask = async (taskId: string, reason: string) => {
    const res = await fetch(`/api/tasks/${taskId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (data.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
      fetchFreshData();
    }
  };

  const sendMessage = async (taskId: string | undefined, recipientId: string, text: string, type: any = 'text') => {
    if (!currentUser) return;
    const payload = {
      taskId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId,
      text,
      type
    };
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const newMsg = await res.json();
    setMessages(prev => [...prev, newMsg]);
  };

  const withdrawEarnings = async (amount: number, method: 'upi' | 'bank_account', accountDetails: string) => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/payouts/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          amount,
          method,
          accountDetails
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchFreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const submitReview = async (reviewData: Partial<Review>) => {
    if (!currentUser) return;
    const payload = {
      ...reviewData,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
    };
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const newRev = await res.json();
    setReviews(prev => [newRev, ...prev]);
    fetchFreshData();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (_) {}
  };

  const triggerSOS = async () => {
    if (!currentUser) return;
    try {
      await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          location: currentUser.location
        })
      });
      fetchFreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const loginUser = async (identifier: string, password?: string, otp?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, otp }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsLoginModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const loginAdmin = async (email: string, password: string, otp?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('helpmate_admin_auth', 'true');
        setIsAdminLoginModalOpen(false);
        setActiveTab('admin');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Admin login error:', err);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('helpmate_admin_auth');
    if (currentUser?.role === 'admin') {
      const regularUser = users.find(u => u.role !== 'admin') || users[0];
      if (regularUser) setCurrentUser(regularUser);
    }
    setActiveTab('dashboard');
  };

  const verifyUserAdmin = async (userId: string, action: 'verify' | 'reject', note?: string) => {
    try {
      const res = await fetch('/api/admin/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action,
          adminId: currentUser?.id || 'admin-1',
          adminName: currentUser?.name || 'Admin Office',
          note,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        if (data.log) {
          setAdminVerificationLogs(prev => [data.log, ...prev]);
        }
      }
    } catch (err) {
      console.error('User verification error:', err);
    }
  };

  const verifyHelperAdmin = async (userId: string, action: 'verify' | 'reject', note?: string) => {
    try {
      const res = await fetch('/api/admin/verify-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action,
          adminId: currentUser?.id || 'admin-1',
          adminName: currentUser?.name || 'Admin Office',
          note,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? data.user : u));
        if (data.log) {
          setAdminVerificationLogs(prev => [data.log, ...prev]);
        }
      }
    } catch (err) {
      console.error('Helper verification error:', err);
    }
  };

  const matchHelpersForTask = async (taskLocation: any, category: string, urgency: string) => {
    const res = await fetch('/api/helpers/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskLocation, category, urgency }),
    });
    return res.json();
  };

  const markNotificationsRead = async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = async () => {
    await fetch('/api/demo/reset', { method: 'POST' });
    await fetchFreshData();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA] dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#FF6B2B] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-lg">Loading 🤝 HelpMate...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        tasks,
        messages,
        notifications,
        transactions,
        reviews,
        sosAlerts,
        adminAnalytics,
        adminVerificationLogs,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        searchQuery,
        setSearchQuery,
        isPostModalOpen,
        setIsPostModalOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isSOSModalOpen,
        setIsSOSModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        selectedTaskForDetail,
        setSelectedTaskForDetail,
        incomingTaskPopup,
        setIncomingTaskPopup,
        googleMapsApiKey,
        googleMapsConfigured,
        switchUser,
        loginUser,
        loginAdmin,
        logoutAdmin,
        toggleHelperMode,
        setHelperStatus,
        createHelpRequest,
        analyzeTaskWithAI,
        acceptTask,
        verifyTaskOTP,
        markTaskComplete,
        confirmTaskCompletion,
        disputeTask,
        sendMessage,
        withdrawEarnings,
        submitReview,
        triggerSOS,
        markNotificationsRead,
        verifyUserAdmin,
        verifyHelperAdmin,
        matchHelpersForTask,
        resetDemoData,
        fetchFreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
