import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, Lock, Mail, User, Sparkles, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onSuccessNavigate?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessNavigate, onSwitchToRegister }) => {
  const { login, quickDemoLogin, isLoading } = useAuth();
  const [role, setRole] = useState<'admin' | 'student'>('admin');
  const [email, setEmail] = useState('operator@ecowise.ai');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleRoleChange = (selectedRole: 'admin' | 'student') => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('operator@ecowise.ai');
      setPassword('admin123');
    } else {
      setEmail('student@ecowise.ai');
      setPassword('student123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please provide both username/email and password.');
      return;
    }

    try {
      await login({ email, password });
      if (onSuccessNavigate) {
        onSuccessNavigate();
      }
    } catch {
      setErrorMsg('Invalid credentials. Try quick demo login buttons below.');
    }
  };

  const handleQuickLogin = async (selectedRole: 'admin' | 'student') => {
    setErrorMsg('');
    try {
      await quickDemoLogin(selectedRole);
      if (onSuccessNavigate) {
        onSuccessNavigate();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Authentication failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-900/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Centered Auth Modal */}
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-xl p-8 relative z-10">
        
        {/* Header with Institutional Gold Seal Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-b from-amber-400/20 to-amber-600/10 border border-amber-400/40 rounded-2xl mb-4 shadow-lg shadow-amber-500/10">
            {/* Institutional Gold Seal Badge SVG */}
            <svg className="w-10 h-10 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="12" cy="12" r="9" className="stroke-amber-400/30" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3" strokeLinecap="round" />
              <path d="M12 7a5 5 0 100 10 5 5 0 000-10z" fill="currentColor" fillOpacity="0.15" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            EcoWise AI
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-700/60 text-emerald-400 font-mono">v2.4</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-2 font-medium">
            Secure Access for System Operators / Campus Community
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="mb-6 p-1 bg-zinc-950/80 border border-zinc-800 rounded-2xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
              role === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Operator / Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
              role === 'student'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student / Campus</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              {role === 'admin' ? 'Operator Identifier / Email' : 'Student ID / Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'operator@ecowise.ai' : 'student@ecowise.ai'}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-medium transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 flex items-center justify-center space-x-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-block animate-pulse">Authenticating Operator...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <p className="text-center text-xs text-zinc-400 font-semibold mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo 1-Click Access:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-medium text-emerald-400 hover:text-emerald-300 transition flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Demo Operator</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="py-2 px-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-medium text-sky-400 hover:text-sky-300 transition flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Student</span>
            </button>
          </div>
        </div>

        {/* Register Switch Link */}
        <div className="mt-6 text-center text-xs text-zinc-500">
          New campus operator or research member?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
          >
            Register Account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Reset Password</h3>
            </div>

            {resetEmailSent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm text-zinc-300">
                  Password reset link dispatched to <span className="text-emerald-400 font-mono">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmailSent(false);
                    setShowForgotPasswordModal(false);
                  }}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Enter your registered campus email address to receive an instant authentication reset token.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@ecowise.ai"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="w-1/2 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetEmailSent(true)}
                    className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Send Token
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
