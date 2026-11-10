import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sun,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Loader2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { images } from '../../data/images';

export default function AdminLoginPage() {
  const { login, adminUser, isLoadingAuth } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated and redirected from a protected route
  useEffect(() => {
    if (adminUser && !isLoadingAuth && location.state?.from) {
      navigate(from, { replace: true });
    }
  }, [adminUser, isLoadingAuth, from, navigate, location.state]);

  const [email, setEmail] = useState('admin@solardepot.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Carousel State for Right Image Panel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      image:
        images.heroInstall ||
        'https://images.pexels.com/photos/9875418/pexels-photo-9875418.jpeg?auto=compress&cs=tinysrgb&w=1920',
      badge: 'Solar Depot Platform',
      headline: 'Power your business with intelligent solar solutions.',
      subtitle:
        'Real-time product inventory, customer quote requests, and verified installation projects in one unified platform.',
      objectPosition: 'center 28%',
    },
    {
      image:
        images.inverterInstall ||
        'https://images.pexels.com/photos/38171111/pexels-photo-38171111.jpeg?auto=compress&cs=tinysrgb&w=1920',
      badge: 'Engineering Review',
      headline: 'Streamlined inverter catalog & technical specs.',
      subtitle:
        'Manage high-efficiency inverter models, system architectures, and partner proposals with instant client sync.',
      objectPosition: 'center 25%',
    },
    {
      image:
        images.farmAerial ||
        'https://images.pexels.com/photos/9893731/pexels-photo-9893731.jpeg?auto=compress&cs=tinysrgb&w=1920',
      badge: 'Commercial Fleet',
      headline: 'Utility-scale monitoring & commercial assets.',
      subtitle:
        'Track verified installer deployments, project portfolios, and commercial customer accounts effortlessly.',
      objectPosition: 'center center',
    },
  ];

  // Preload carousel images for instant cross-fade
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-rotate every 5 seconds, pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    try {
      setIsLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@solardepot.com');
    setPassword('Admin@123');
    setErrorMessage('');
    setFieldErrors({});
  };

  const isFormValid = email.trim().length > 0 && password.length > 0;

  return (
    <div className="relative min-h-[100dvh] w-full bg-white select-none overflow-x-hidden">
      {/* Scoped CSS animations & WebKit Autofill Overrides */}
      <style>{`
        @keyframes subtleZoom {
          0% {
            transform: scale(1.0);
          }
          100% {
            transform: scale(1.03);
          }
        }
        .animate-subtle-zoom {
          animation: subtleZoom 8s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-subtle-zoom {
            animation: none !important;
            transform: none !important;
          }
        }
        .admin-login-input:-webkit-autofill,
        .admin-login-input:-webkit-autofill:hover, 
        .admin-login-input:-webkit-autofill:focus,
        .admin-login-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #071B2A !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Full-Screen 2-Column Split Layout */}
      <div className="w-full min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT COLUMN: Clean White Form Area (Full Bleed Left Half) */}
        <div className="p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between bg-white relative min-w-0 min-h-[100dvh]">
          {/* Header Row: Logo & Status Badge */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fd8a6a] via-[#FC734D] to-[#e85a34] flex items-center justify-center shadow-md shadow-cantaloupe-500/25">
                <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-bold text-[19px] tracking-tight leading-none">
                  <span className="text-navy">Solar</span>
                  <span className="text-cantaloupe-500">Depot</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
                  ADMIN CONSOLE
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>System Online</span>
            </div>
          </div>

          {/* Center Form Section */}
          <div className="w-full max-w-[420px] mx-auto my-auto py-6 sm:py-8">
            <h1 className="font-display text-[28px] sm:text-[32px] font-bold text-navy tracking-tight">
              Welcome back
            </h1>
            <p className="text-[14px] text-slate-500 mt-1 leading-relaxed">
              Sign in to manage your solar products, projects and enquiries.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {/* Error Alert Box */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-[13px] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: null }));
                      }
                    }}
                    placeholder="admin@solardepot.com"
                    aria-label="Email address"
                    autoComplete="username"
                    autoFocus
                    className={`admin-login-input w-full h-[48px] pl-10 pr-4 rounded-xl text-[14px] text-navy placeholder:text-slate-400 bg-white border transition-all duration-200 outline-none ${
                      fieldErrors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300 focus:border-cantaloupe-500 focus:ring-2 focus:ring-cantaloupe-500/20'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[12px] text-rose-600 pl-1 font-medium mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: null }));
                      }
                    }}
                    placeholder="••••••••••••"
                    aria-label="Password"
                    autoComplete="current-password"
                    className={`admin-login-input w-full h-[48px] pl-10 pr-11 rounded-xl text-[14px] text-navy placeholder:text-slate-400 bg-white border transition-all duration-200 outline-none ${
                      fieldErrors.password
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300 focus:border-cantaloupe-500 focus:ring-2 focus:ring-cantaloupe-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[12px] text-rose-600 pl-1 font-medium mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-cantaloupe-500 focus:ring-cantaloupe-500/30 border-slate-300 accent-cantaloupe-500 cursor-pointer"
                  />
                  <span className="text-[13px] text-slate-600 font-medium">
                    Remember for 30 days
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[13px] font-semibold text-cantaloupe-600 hover:text-cantaloupe-700 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full h-[50px] rounded-xl font-semibold text-[15px] text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  !isFormValid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#fd8a6a] via-[#FC734D] to-[#e85a34] shadow-[0_12px_28px_-6px_rgba(252,115,77,0.45)] hover:brightness-105 active:scale-[0.99]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Console</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {/* Demo Account Quick-Fill Card (Matches Reference Image) */}
              <div className="rounded-xl bg-orange-50/70 border border-orange-200/70 p-3 flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-[12px] text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-cantaloupe-500" />
                  <span className="text-slate-500 font-medium">Demo:</span>
                  <span className="font-mono text-slate-800 font-medium">
                    admin@solardepot.com
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="px-2.5 py-1 rounded-lg border border-cantaloupe-500/50 text-cantaloupe-600 font-bold text-[10px] tracking-wider uppercase hover:bg-cantaloupe-500 hover:text-white transition-all cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>
            </form>
          </div>

          {/* Footer Row */}
          <div className="flex items-center justify-between text-[12px] text-slate-400 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure encrypted access</span>
            </div>
            <span>© 2026 Solar Depot. All rights reserved.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Deep Dark Navy Showcase with Photo & Metrics (Full Bleed Right Half) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden lg:flex flex-col justify-between p-8 xl:p-12 relative bg-[#071B2A] text-white select-none overflow-hidden min-h-[100dvh]"
          style={{
            background:
              'linear-gradient(155deg, #071B2A 0%, #092235 50%, #05141f 100%)',
          }}
        >
          {/* Top Metrics Row */}
          <div className="relative z-20 flex items-center justify-between gap-3">
            {/* Metric 1 */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-[9px] font-bold text-slate-300 tracking-wider uppercase">
                  Catalog Live
                </div>
                <div className="text-[12px] font-semibold text-white">
                  13+ Inverters Synced
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-cantaloupe-400" />
              <div>
                <div className="text-[9px] font-bold text-slate-300 tracking-wider uppercase">
                  Verified Network
                </div>
                <div className="text-[12px] font-semibold text-white">
                  Tier-1 EPC Partners
                </div>
              </div>
            </div>
          </div>

          {/* Center Card Presentation with Solar Photo */}
          <div className="relative z-10 my-auto py-6 max-w-[540px] xl:max-w-[580px] w-full mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 h-[360px] xl:h-[400px]">
              {/* Photo Slides */}
              {slides.map((slide, idx) => (
                <img
                  key={idx}
                  src={slide.image}
                  alt={slide.headline}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    currentSlide === idx
                      ? 'opacity-100 animate-subtle-zoom'
                      : 'opacity-0'
                  }`}
                  style={{
                    objectPosition: slide.objectPosition,
                    filter: 'saturate(1.1) contrast(1.05)',
                  }}
                />
              ))}

              {/* Gradient masks for readable text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B2A]/95 via-[#071B2A]/40 via-45% to-transparent pointer-events-none" />

              {/* Overlaid Headline & Information at the bottom of the card */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cantaloupe-500/20 border border-cantaloupe-500/40 text-cantaloupe-400 text-[11px] font-bold tracking-wider uppercase mb-2.5 backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-cantaloupe-400 text-cantaloupe-400" />
                  <span>{slides[currentSlide].badge}</span>
                </div>

                {/* Main Headline */}
                <h2 className="font-display text-[22px] xl:text-[26px] font-bold text-white leading-tight tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                  {slides[currentSlide].headline}
                </h2>

                {/* Subtitle */}
                <p className="text-[13px] text-slate-300 mt-2 leading-relaxed font-sans line-clamp-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Carousel Indicators */}
                <div className="flex items-center gap-2 mt-4">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 cursor-pointer ${
                        currentSlide === idx
                          ? 'w-7 h-2 rounded-full bg-cantaloupe-500 shadow-sm'
                          : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="relative z-20 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10 font-mono">
            <span>SolarDepot Enterprise Network</span>
            <span>© 2026 SolarDepot Inc.</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-[#0297DE]/20 animate-card-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-navy font-semibold text-[16px]">
                <Info className="w-4 h-4 text-electric-500" />
                <span>Reset Password</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[14px] text-slate-600 mt-4 leading-relaxed">
              Contact your Super Admin to reset your password or unlock your
              account credentials.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-iceblue/60 border border-electric-500/20 text-[13px] text-navy font-medium">
              Super Admin Support:{' '}
              <span className="font-semibold text-electric-600">
                admin@solardepot.com
              </span>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="mt-5 w-full h-10 rounded-xl bg-navy text-white text-[13px] font-semibold hover:bg-navy-700 transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
