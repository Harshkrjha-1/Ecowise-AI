import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SensorsPage } from './pages/SensorsPage';
import { AgentPage } from './pages/AgentPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { 
  Leaf, LayoutDashboard, Scan, Cpu, BarChart3, Bot, BookOpen, Bell, LogOut, User as UserIcon, Shield, Search, ChevronDown, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, X
} from 'lucide-react';

function MainApp() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Live clock updating every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Notifications list
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Science Block Contamination Spike', time: '14:22 PM', level: 'high', read: false },
    { id: '2', title: 'Sorting Arm #2 Calibration Passed', time: '13:50 PM', level: 'nominal', read: false },
    { id: '3', title: 'Granite RAG Rule Sync Completed', time: '12:00 PM', level: 'info', read: false },
  ]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadNotifications(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3 text-emerald-400">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium font-mono">Initializing EcoWise AI Operations System...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
        {/* Simple Top Header for Auth view */}
        <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shadow-lg shadow-emerald-950/50">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
                  EcoWise AI
                </h1>
                <p className="text-xs text-emerald-400 font-mono">Sustainable Campus Resource & Waste Intelligence</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAuthMode('login')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  authMode === 'login'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  authMode === 'register'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {authMode === 'login' ? (
            <LoginPage
              onSuccessNavigate={() => setActiveTab('dashboard')}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </main>

        <footer className="border-t border-zinc-800 py-4 bg-zinc-950 text-center text-xs text-zinc-500 font-mono">
          EcoWise AI &copy; 2026 • SDG 12, 11, 13, 4 • Powered by React & FastAPI
        </footer>
      </div>
    );
  }

  // Sidebar navigation menu items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Smart Waste Scanner', icon: Scan },
    { id: 'sensors', label: 'Sensor Hub', icon: Cpu },
    { id: 'analytics', label: 'Resource Analytics', icon: BarChart3 },
    { id: 'agent', label: 'EcoAction Agent', icon: Bot },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden font-sans">
      
      {/* Left Dark Navigation Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 shrink-0 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shadow-md">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">EcoWise AI</h1>
              <p className="text-[11px] text-emerald-400 font-mono font-medium mt-1">Sustainable Campus AI</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status Widget */}
        <div className="p-4 border-t border-zinc-800 m-3 bg-zinc-950/70 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">AI Engine:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online v2.4
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-400">MQTT Mesh:</span>
            <span className="text-cyan-400 font-bold">12 Nodes Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Top Operational Header */}
        <header className="bg-zinc-900/90 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur px-6 py-3.5 flex items-center justify-between">
          
          {/* Mobile Tab Select Dropdown / Left Header Title */}
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold py-1.5 px-3 rounded-xl focus:outline-none"
              >
                {navItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All Systems Nominal</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">Latency: 12ms</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-bold">{currentTimeStr}</span>
            </div>
          </div>

          {/* Header Right Actions: Notifications & User Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Quick-action Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl relative transition"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-zinc-950 font-mono text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Notifications</h4>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white truncate">{n.title}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">System alert dispatched to operations log.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-1.5 pl-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl transition"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs font-mono">
                  {user?.full_name ? user.full_name.charAt(0) : 'O'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white truncate max-w-[120px]">{user?.full_name}</div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">{user?.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Profile Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-3 space-y-2">
                  <div className="p-2 border-b border-zinc-800">
                    <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                      {user?.department}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-rose-400 hover:bg-zinc-800 rounded-xl text-xs font-semibold transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Viewport Render Area */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardPage onNavigateTab={(tab) => setActiveTab(tab)} />}
          {activeTab === 'scanner' && <ScannerPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'sensors' && <SensorsPage />}
          {activeTab === 'agent' && <AgentPage />}
          {activeTab === 'kb' && <KnowledgeBasePage />}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
