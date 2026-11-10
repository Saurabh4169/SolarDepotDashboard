import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, Info, X } from 'lucide-react';
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

  const [searchParams] = useSearchParams();

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
        images.technicianInspect ||
        'https://images.pexels.com/photos/6961110/pexels-photo-6961110.jpeg?auto=compress&cs=tinysrgb&w=1920',
      headline: 'Power your business with intelligent solar solutions.',
      subtitle: 'Manage inverters, projects and customer quotes in one place.',
    },
    {
      image:
        images.heroInstall ||
        'https://images.pexels.com/photos/9875418/pexels-photo-9875418.jpeg?auto=compress&cs=tinysrgb&w=1920',
      headline: 'Manage inverters, projects and quotes in one place.',
      subtitle: 'Real-time hardware inventory and pricing specifications.',
    },
    {
      image:
        images.installDrill ||
        'https://images.pexels.com/photos/4254164/pexels-photo-4254164.jpeg?auto=compress&cs=tinysrgb&w=1920',
      headline: 'Track every enquiry from request to delivery.',
      subtitle: 'Streamlined engineering review and EPC quote pipeline.',
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
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-br from-[#DDF1FA] to-[#EAF6FC] flex items-center justify-center p-3 sm:p-6 lg:p-8 select-none overflow-hidden">
      {/* Background ambient decorative layers strictly clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-28 -left-28 w-[500px] h-[500px] rounded-full bg-[#0297DE]/18 blur-[130px]" />
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
      <div className="relative z-10 w-full max-w-[1120px] lg:h-[640px] bg-white/[0.92] backdrop-blur-[16px] rounded-[24px] border border-[#0297DE]/12 shadow-[0_30px_80px_-20px_rgba(7,27,42,0.25)] animate-card-enter grid grid-cols-1 lg:grid-cols-2 p-3 sm:p-4 gap-0 my-auto min-w-0">
        {/* LEFT COLUMN: Login Form Area */}
        <div className="flex flex-col justify-between p-4 sm:p-6 lg:p-10 h-full relative min-w-0">
          {/* Top Logo */}
          <div className="flex items-center">
            <Logo size="sm" light={false} linkTo="/" />
          </div>

          {/* Form Block (Vertically Centered) */}
          <div className="w-full max-w-[380px] mx-auto my-auto py-4 sm:py-6">
            {/* Title & Subtitle */}
            <div className="mb-5 sm:mb-6">
              <h1 className="font-display text-[26px] sm:text-[28px] font-semibold text-navy leading-tight tracking-tight">
                Sign in
              </h1>
              <p className="text-[13px] sm:text-[14px] text-slate-500 mt-1">
                Access the Solar Depot admin console
              </p>
            </div>

            {/* Error Message Alert Box */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-[13px] font-medium text-rose-700 animate-fade-in flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Input */}
              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    autoFocus
                    autoComplete="username"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                    }}
                    placeholder="Email address"
                    className={`w-full h-12 pl-10 pr-4 rounded-xl text-[14px] bg-white border ${
                      fieldErrors.email
                        ? 'border-rose-400 ring-1 ring-rose-300'
                        : 'border-[#0297DE]/20'
                    } text-navy placeholder:text-slate-400 font-medium transition-all shadow-sm focus:outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/25`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[12px] text-rose-600 mt-1 pl-1 font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password)
                        setFieldErrors({ ...fieldErrors, password: null });
                    }}
                    placeholder="Password"
                    className={`w-full h-12 pl-10 pr-11 rounded-xl text-[14px] bg-white border ${
                      fieldErrors.password
                        ? 'border-rose-400 ring-1 ring-rose-300'
                        : 'border-[#0297DE]/20'
                    } text-navy placeholder:text-slate-400 font-medium transition-all shadow-sm focus:outline-none focus:border-electric-500 focus:ring-2 focus:ring-electric-500/25`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-slate-400 hover:text-navy absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[12px] text-rose-600 mt-1 pl-1 font-medium">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between gap-2 text-[12px] sm:text-[13px] pt-0.5">
                <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none text-slate-600 hover:text-navy">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-electric-600 focus:ring-electric-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-medium text-electric-600 hover:text-electric-700 hover:underline transition-colors shrink-0"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full h-12 rounded-xl text-[15px] font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 select-none ${
                  !isFormValid
                    ? 'bg-slate-300/80 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-cantaloupe-400 via-cantaloupe-500 to-cantaloupe-600 hover:brightness-105 active:scale-[0.99] shadow-orange hover:shadow-[0_8px_25px_rgba(252,115,77,0.45)]'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              {/* Demo Credentials Quick-Fill helper */}
              <div className="pt-2 flex items-center justify-between text-[12px] text-slate-400">
                <span className="truncate mr-2">Demo: admin@solardepot.com</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="font-semibold text-electric-600 hover:text-electric-700 hover:underline shrink-0"
                >
                  Auto-fill
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Copyright */}
          <div className="text-[12px] text-slate-400 pt-3 sm:pt-2">
            © 2026 Solar Depot. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: Rounded Image Panel with Inner Glass Frame */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden lg:flex relative rounded-[20px] overflow-hidden h-full flex-col justify-between p-6 select-none"
          style={{
            background: 'linear-gradient(145deg, #071B2A 0%, #0b2f4a 45%, #0297DE 100%)',
          }}
        >
          {/* Faint Concentric Ripple Arcs (8-10% opacity) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-[480px] h-[480px] rounded-full border border-white/[0.09]" />
            <div className="absolute -bottom-32 -left-32 w-[640px] h-[640px] rounded-full border border-white/[0.08]" />
            <div className="absolute -bottom-44 -left-44 w-[800px] h-[800px] rounded-full border border-white/[0.07]" />
          </div>

          {/* Soft Blurred Cantaloupe Glow Dot (matches reference orange blur) */}
          <div className="absolute top-28 left-20 w-16 h-16 rounded-full bg-cantaloupe-500/70 blur-xl pointer-events-none" />

          {/* Inner Glass Frame */}
          <div className="relative z-10 w-full h-full rounded-[18px] border border-white/25 bg-gradient-to-br from-white/[0.14] to-white/[0.04] backdrop-blur-[14px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] p-7 flex flex-col justify-between overflow-hidden">
            {/* Top Headline & Subtitle */}
            <div className="relative z-20 max-w-[380px]">
              <h2 className="font-display text-[30px] lg:text-[32px] font-semibold text-white leading-[1.18] tracking-tight">
                {slides[currentSlide].headline}
              </h2>
              <p className="text-[14px] text-white/75 mt-2.5 leading-relaxed font-sans">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Solar Worker Photo at Bottom-Right with Gradient Fade */}
            <div className="absolute right-0 bottom-0 w-[85%] h-[74%] pointer-events-none select-none z-10 overflow-hidden">
              {slides.map((slide, idx) => (
                <img
                  key={idx}
                  src={slide.image}
                  alt="Solar Engineer"
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out ${
                    currentSlide === idx ? 'opacity-90' : 'opacity-0'
                  }`}
                  style={{
                    maskImage:
                      'linear-gradient(to top, transparent 0%, black 18%, black 100%), linear-gradient(to left, black 65%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to top, transparent 0%, black 18%, black 100%), linear-gradient(to left, black 65%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'destination-in',
                  }}
                />
              ))}
              {/* Subtle bottom gradient tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B2A]/75 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bottom-Left Carousel Dots */}
            <div className="relative z-20 flex items-center gap-2">
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
              Contact your Super Admin to reset your password or unlock your account credentials.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-iceblue/60 border border-electric-500/20 text-[13px] text-navy font-medium">
              Super Admin Support: <span className="font-semibold text-electric-600">admin@solardepot.com</span>
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
