import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { HelpRequestsView } from './components/requests/HelpRequestsView';
import { LiveMapView } from './components/map/LiveMapView';
import { FindHelpersView } from './components/helpers/FindHelpersView';
import { MyTasksView } from './components/tasks/MyTasksView';
import { MessagesView } from './components/chat/MessagesView';
import { WalletView } from './components/wallet/WalletView';
import { ReviewsView } from './components/reviews/ReviewsView';
import { RewardsView } from './components/rewards/RewardsView';
import { SafetyCenterView } from './components/safety/SafetyCenterView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminPanelView } from './components/admin/AdminPanelView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { PostRequestModal } from './components/requests/PostRequestModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { SOSModal } from './components/safety/SOSModal';
import { UserLoginModal } from './components/auth/UserLoginModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { RapidoTaskOfferModal } from './components/helper/RapidoTaskOfferModal';

// Mobile bottom bar icons
import { Home, HelpCircle, MapPin, Users, MessageSquare, ClipboardList, Wallet } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsAIAssistantOpen, setIsSOSModalOpen } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'requests':
        return <HelpRequestsView />;
      case 'map':
        return <LiveMapView />;
      case 'helpers':
        return <FindHelpersView />;
      case 'tasks':
        return <MyTasksView />;
      case 'messages':
        return <MessagesView />;
      case 'wallet':
        return <WalletView />;
      case 'reviews':
        return <ReviewsView />;
      case 'rewards':
        return <RewardsView />;
      case 'safety':
        return <SafetyCenterView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminPanelView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F8FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Desktop Navigation Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopHeader />

        {/* Floating Frosted Glass Action Dock */}
        <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2">
          <div className="frosted-glass p-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/60 dark:border-slate-700/60 transition-all hover:shadow-orange-500/10">
            <button
              id="btn-trigger-ai-dock"
              onClick={() => setIsAIAssistantOpen(true)}
              title="HelpMate AI Assistant"
              className="w-11 h-11 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center text-lg shadow-lg hover:scale-110 active:scale-95 transition-all group"
            >
              <span className="group-hover:rotate-12 transition-transform">🤖</span>
            </button>
            <button
              id="btn-trigger-sos-dock"
              onClick={() => setIsSOSModalOpen(true)}
              title="Emergency SOS Broadcast"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-black text-xs shadow-lg shadow-red-600/30 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar (Secondary support) */}
        <div className="md:hidden bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around z-30 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'dashboard' ? 'text-[#FF6B2B]' : 'text-slate-500'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'requests' ? 'text-[#FF6B2B]' : 'text-slate-500'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'map' ? 'text-[#FF6B2B]' : 'text-slate-500'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'tasks' ? 'text-[#FF6B2B]' : 'text-slate-500'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'messages' ? 'text-[#FF6B2B]' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              activeTab === 'wallet' ? 'text-[#FF6B2B]' : 'text-slate-500'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet</span>
          </button>
        </div>
      </div>

      {/* Global Application Modals */}
      <PostRequestModal />
      <AIAssistantModal />
      <SOSModal />
      <UserLoginModal />
      <AdminLoginModal />
      <RapidoTaskOfferModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
