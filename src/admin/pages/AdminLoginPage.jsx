import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Info,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Logo from '../../components/common/Logo';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      objectPosition: 'center 30%',
      headline: 'Power your business with intelligent solar solutions.',
      subtitle: 'Track inventory, pricing and specifications in real time.',
    },
    {
      image:
        images.inverterInstall ||
        'https://images.pexels.com/photos/38171111/pexels-photo-38171111.jpeg?auto=compress&cs=tinysrgb&w=1920',
      objectPosition: 'center 25%',
      headline: 'Streamlined engineering review & quote pipeline.',
      subtitle: 'Track inventory, pricing and specifications in real time.',
    },
    {
      image:
        images.farmAerial ||
        'https://images.pexels.com/photos/9893731/pexels-photo-9893731.jpeg?auto=compress&cs=tinysrgb&w=1920',
      objectPosition: 'center center',
      headline: 'Utility-scale monitoring & commercial assets.',
      subtitle: 'Track inventory, pricing and specifications in real time.',
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

  const isFormValid = email.trim().length > 0 && password.length > 0;

  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-br from-[#DDF1FA] to-[#F7FAFC] flex items-center justify-center p-0 sm:p-4 lg:p-6 select-none overflow-x-hidden overflow-y-auto">
      {/* Scoped CSS animations & WebKit Autofill Overrides */}
      <style>{`
        @keyframes loginCardEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-login-card {
          animation: loginCardEnter 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slowZoom {
          0% {
            transform: scale(1.0);
          }
          100% {
            transform: scale(1.04);
          }
        }
        .animate-slow-zoom {
          animation: slowZoom 8s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-login-card {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .animate-slow-zoom {
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

      {/* Background ambient decorative layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow circles */}
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#0297DE]/18 blur-[130px]" />
        <div className="absolute -bottom-28 -right-28 w-[480px] h-[480px] rounded-full bg-[#FC734D]/12 blur-[130px]" />

        {/* Decorative Faint Dashed Curved Lines */}
        <svg
          className="w-full h-full stroke-white/40"
          fill="none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100,520 C 220,460 380,240 540,110 C 700,-30 940,90 1250,40"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <path
            d="M 180,950 C 480,900 820,780 1140,460 C 1340,240 1560,140 1780,90"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <path
            d="M -60,220 C 280,240 620,470 940,630 C 1240,780 1540,830 1850,870"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      {/* Main Centered Card */}
      <div className="relative z-10 w-full sm:w-[94%] max-w-[460px] lg:max-w-[1180px] min-h-[100dvh] sm:min-h-0 sm:h-[min(680px,92dvh)] bg-white/[0.94] backdrop-blur-[16px] rounded-none sm:rounded-[28px] border-0 sm:border border-[#0297DE]/12 shadow-none sm:shadow-[0_30px_80px_-20px_rgba(7,27,42,0.28)] p-5 sm:p-[14px] animate-login-card grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-[14px] overflow-hidden my-auto">
        {/* LEFT COLUMN: Login Form Area */}
        <div className="flex flex-col justify-between p-4 sm:p-8 h-full relative min-w-0 bg-transparent">
          {/* Top Logo */}
          <div className="flex items-center">
            <Logo size="sm" light={false} linkTo="/" />
          </div>

          {/* Form Block (Vertically Centered) */}
          <div className="w-full max-w-[400px] mx-auto my-auto py-4 sm:py-6">
            {/* Title & Subtitle */}
            <div className="mb-5 sm:mb-6">
              <h1 className="font-display text-[30px] sm:text-[32px] font-semibold text-navy leading-tight tracking-tight">
                Welcome back
              </h1>
              <p className="text-[14px] sm:text-[15px] text-slate-500 mt-1.5 font-sans">
                Sign in to the Solar Depot admin console
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Error Alert Box */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-[13px] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
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
                    placeholder="Email address"
                    aria-label="Email address"
                    autoComplete="username"
                    autoFocus
                    className={`admin-login-input w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[14px] text-navy placeholder:text-slate-400 bg-white border transition-all duration-200 outline-none ${
                      fieldErrors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-[3px] focus:ring-rose-500/20'
                        : 'border-[#0297DE]/20 hover:border-electric-500/40 focus:border-electric-500 focus:ring-[3px] focus:ring-[#0297DE]/18'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[12px] text-rose-600 pl-1 font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
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
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="current-password"
                    className={`admin-login-input w-full h-[52px] pl-11 pr-11 rounded-[14px] text-[14px] text-navy placeholder:text-slate-400 bg-white border transition-all duration-200 outline-none ${
                      fieldErrors.password
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-[3px] focus:ring-rose-500/20'
                        : 'border-[#0297DE]/20 hover:border-electric-500/40 focus:border-electric-500 focus:ring-[3px] focus:ring-[#0297DE]/18'
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
                  <p className="text-[12px] text-rose-600 pl-1 font-medium">
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
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[13px] font-semibold text-electric-600 hover:text-electric-700 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full h-[52px] rounded-[14px] font-semibold text-[15px] text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  !isFormValid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-[#fd8a6a] via-[#FC734D] to-[#e85a34] shadow-[0_12px_28px_-6px_rgba(252,115,77,0.45)] hover:-translate-y-[1px] active:translate-y-0'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              {/* Trust Badge Line */}
              <div className="flex items-center justify-center gap-1.5 text-[12px] text-slate-400 pt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Secure admin access</span>
              </div>

              {/* DEV credentials hint (dev mode only) */}
              {import.meta.env.DEV && (
                <div className="pt-1.5 text-center text-[11px] text-slate-400 font-mono">
                  Demo credentials: admin@solardepot.com / Admin@123
                </div>
              )}
            </form>
          </div>

          {/* Bottom Copyright */}
          <div className="text-[12px] text-slate-400 pt-2 font-sans">
            © 2026 Solar Depot. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: Redesigned Image Panel with Glass Frame */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden lg:block relative rounded-[22px] overflow-hidden h-full select-none"
          style={{
            background:
              'linear-gradient(150deg, #071B2A 0%, #0b2f4a 40%, #0297DE 100%)',
          }}
        >
          {/* Photo Layer with object-position & slow-zoom */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
            {slides.map((slide, idx) => (
              <img
                key={idx}
                src={slide.image}
                alt={slide.headline}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                  currentSlide === idx
                    ? 'opacity-100 animate-slow-zoom'
                    : 'opacity-0'
                }`}
                style={{
                  objectPosition: slide.objectPosition,
                  filter: 'saturate(1.1) contrast(1.05)',
                }}
              />
            ))}
          </div>

          {/* Top Gradient Mask (top 35% for headline contrast) */}
          <div className="absolute top-0 left-0 right-0 h-[35%] bg-gradient-to-b from-[#071B2A]/85 via-[#071B2A]/40 to-transparent pointer-events-none z-10" />

          {/* Bottom Gradient Mask (bottom 25% for bottom card & dots contrast) */}
          <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-[#071B2A]/75 via-[#071B2A]/30 to-transparent pointer-events-none z-10" />

          {/* Decorative faint concentric circular arcs (white 8-10% opacity) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full border border-white/[0.09]" />
            <div className="absolute -bottom-36 -right-36 w-[620px] h-[620px] rounded-full border border-white/[0.08]" />
            <div className="absolute -bottom-48 -right-48 w-[780px] h-[780px] rounded-full border border-white/[0.07]" />
          </div>

          {/* Blurred cantaloupe glow dot */}
          <div className="absolute top-24 left-16 w-24 h-24 rounded-full bg-cantaloupe-500/35 blur-[40px] pointer-events-none z-10" />

          {/* Inner Glass Frame (inset 20px, radius 18px, sharp photo view) */}
          <div
            className="absolute inset-[20px] rounded-[18px] border border-white/[0.28] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] p-7 xl:p-8 flex flex-col justify-between z-20 pointer-events-none overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
            }}
          >
            {/* Top Headline & Subtitle */}
            <div className="max-w-[80%]">
              <h2 className="font-display text-[26px] xl:text-[32px] font-semibold text-white leading-[1.2] tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
                {slides[currentSlide].headline}
              </h2>
              <p className="text-[13px] xl:text-[14px] text-white/85 mt-2 font-sans [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Bottom Row: Floating Live Info Card (Left) & Carousel Dots (Right) */}
            <div className="flex items-end justify-between w-full">
              {/* Floating Glass Info Card */}
              <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] bg-[#071B2A]/70 backdrop-blur-[14px] border border-white/20 shadow-lg select-none">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <div className="leading-tight">
                  <div className="text-[12px] font-semibold text-white">
                    Live catalog
                  </div>
                  <div className="text-[11px] text-slate-300">
                    12 inverters synced
                  </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="pointer-events-auto flex items-center gap-2 pb-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-300 cursor-pointer ${
                      currentSlide === idx
                        ? 'w-7 h-2 rounded-full bg-white shadow-sm'
                        : 'w-2 h-2 rounded-full bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
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
              className="mt-5 w-full h-10 rounded-xl bg-navy text-white text-[13px] font-semibold hover:bg-navy-700 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
