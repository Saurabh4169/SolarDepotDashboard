import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sun, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Button from '../../components/common/Button';

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('admin@solardepot.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@solardepot.com');
    setPassword('Admin@123');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 w-full h-full min-h-[100dvh] bg-[linear-gradient(135deg,#02070A_0%,#071B2A_55%,#0b2436_100%)] flex items-center justify-center p-4 sm:p-6 z-40 select-none overflow-y-auto">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-cantaloupe-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card (Glass-Dark) */}
      <div className="relative w-full max-w-md glass-dark rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/14 z-10 animate-fade-in my-auto text-white">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-400 to-electric-600 shadow-glow flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cantaloupe-500 border-2 border-[#071B2A] flex items-center justify-center shadow-orange">
              <ShieldCheck className="w-3 h-3 text-white" />
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Solar<span className="text-electric-400">Depot</span>
          </h1>
          <p className="text-[14px] text-slate-300 mt-1 font-sans">
            Operations & Engineering Management Portal
          </p>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-[13px] font-medium text-rose-200 animate-fade-in">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@solardepot.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl text-[14px] bg-white/10 border border-white/15 focus:outline-none focus:border-electric-400 focus:bg-white/15 focus:ring-2 focus:ring-electric-400/25 text-white placeholder:text-slate-400 font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[12px] font-semibold text-electric-300 hover:text-electric-200 hover:underline"
              >
                Auto-fill credentials
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl text-[14px] bg-white/10 border border-white/15 focus:outline-none focus:border-electric-400 focus:bg-white/15 focus:ring-2 focus:ring-electric-400/25 text-white placeholder:text-slate-400 font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-6 pt-4 border-t border-white/10 bg-white/[0.04] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 rounded-b-3xl">
          <div className="flex items-center justify-between text-[13px] text-slate-300">
            <span className="font-semibold text-white">Demo Credentials:</span>
            <button
              onClick={fillDemoCredentials}
              className="text-[12px] font-semibold text-cantaloupe-400 hover:text-cantaloupe-300"
            >
              Fill Credentials
            </button>
          </div>
          <div className="mt-2 space-y-1.5 text-[13px] text-slate-300 bg-white/[0.06] p-3 rounded-xl border border-white/10 tabular-nums">
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-white">admin@solardepot.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Password:</span>
              <span className="font-semibold text-white">Admin@123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="font-semibold text-emerald-400">Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

