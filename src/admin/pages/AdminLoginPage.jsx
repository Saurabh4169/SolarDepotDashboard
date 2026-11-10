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
    <div className="fixed inset-0 w-full h-full min-h-[100dvh] bg-gradient-to-br from-midnight via-navy to-midnight-100 flex items-center justify-center p-4 sm:p-6 z-40 select-none overflow-y-auto">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-cantaloupe-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-electric-500/20 z-10 animate-fade-in my-auto">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-400 to-electric-600 shadow-glow flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cantaloupe-500 border-2 border-white flex items-center justify-center shadow-orange">
              <ShieldCheck className="w-3 h-3 text-white" />
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-navy">
            Solar<span className="text-electric-500">Depot</span>
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 font-sans">
            Operations & Engineering Management Portal
          </p>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-[13px] font-medium text-rose-700 animate-fade-in">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
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
                className="w-full h-11 pl-10 pr-4 rounded-xl text-[14px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-electric-500 focus:bg-white focus:ring-1 focus:ring-electric-500 text-navy font-medium transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-slate-600">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[12px] font-semibold text-electric-600 hover:text-electric-700 hover:underline"
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
                className="w-full h-11 pl-10 pr-10 rounded-xl text-[14px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-electric-500 focus:bg-white focus:ring-1 focus:ring-electric-500 text-navy font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-navy absolute right-2.5 top-1/2 -translate-y-1/2"
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
        <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-4 rounded-b-3xl">
          <div className="flex items-center justify-between text-[13px] text-slate-500">
            <span className="font-semibold text-navy">Demo Credentials:</span>
            <button
              onClick={fillDemoCredentials}
              className="text-[12px] font-semibold text-cantaloupe-600 hover:text-cantaloupe-700"
            >
              Fill Credentials
            </button>
          </div>
          <div className="mt-2 space-y-1.5 text-[13px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200 tabular-nums">
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-navy">admin@solardepot.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Password:</span>
              <span className="font-semibold text-navy">Admin@123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="font-semibold text-emerald-600">Super Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

