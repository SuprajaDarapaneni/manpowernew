import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Server,
  Sparkles,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin } = useApp();
  const [email, setEmail] = useState('admin@manpowerlink.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginAdmin(email, password);
    setIsLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setEmail('admin@manpowerlink.com');
    setPassword('admin123');
    await loginAdmin('admin@manpowerlink.com', 'admin123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-900 text-slate-100 font-sans">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Admin Console Sign In
          </h2>
          <p className="text-xs text-slate-400">
            ManPowerLink Master Workforce Control & Operations Portal
          </p>
        </div>

        {/* Compulsory Login Notice */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-snug">
            <strong>Login Compulsory:</strong> Administrator authentication is strictly required before accessing the Admin Dashboard or management tabs.
          </span>
        </div>

        {/* Demo Fast Login Pill */}
        <div className="mb-6 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-emerald-300">Default Superuser</span>
              <p className="text-[11px] text-emerald-400/80">admin@manpowerlink.com • admin123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
          >
            Quick Sign In
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@manpowerlink.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Keep me signed in</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-medium">RBAC Superuser</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted Session</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono text-cyan-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>MongoDB: manpowerlink_db</span>
          </div>
        </div>
      </div>
    </div>
  );
};
