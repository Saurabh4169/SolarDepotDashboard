import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Bell, Search, Share2, Heart, ShieldCheck } from 'lucide-react';
import Logo from '../common/Logo';
import { useApp } from '../../context/AppContext';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    unreadNotificationCount,
    setGlobalSearchOpen,
    favorites,
    showToast,
  } = useApp();

  const isMainTab = ['/', '/products', '/solutions', '/projects', '/profile'].includes(
    location.pathname
  );

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/products/category/')) return 'Category Products';
    if (path.startsWith('/products/')) return 'Product Details';
    if (path.startsWith('/solutions/')) return 'Solution Details';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/categories') return 'All Categories';
    if (path === '/compare') return 'Compare Inverters';
    if (path === '/downloads') return 'Downloads & Docs';
    if (path === '/saved') return 'Saved Products';
    if (path === '/request-quote') return 'Request a Quote';
    if (path === '/my-enquiries') return 'My Enquiries';
    if (path === '/edit-profile') return 'Edit Profile';
    if (path === '/settings') return 'Settings';
    if (path === '/support') return 'Support & Contact';
    if (path === '/notifications') return 'Notifications';
    return 'Solar Depot';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Solar Depot Mobile',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link copied to clipboard', 'info');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-gradient-to-r from-midnight via-[#0b1b28] to-midnight backdrop-blur-xl border-b border-cantaloupe-500/20 shadow-[0_4px_24px_-2px_rgba(252,115,77,0.28)] px-4 flex items-center justify-between text-white shrink-0 relative overflow-hidden">
      {/* Ambient warm orange gradient highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-cantaloupe-500/[0.08] via-transparent to-cantaloupe-500/[0.03] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cantaloupe-500/60 to-transparent pointer-events-none" />

      {isMainTab ? (
        <>
          <Logo size="sm" light={true} />

          <div className="flex items-center gap-1.5">
            {/* Global Search Shortcut */}
            <button
              type="button"
              onClick={() => setGlobalSearchOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Saved shortcut */}
            <Link
              to="/saved"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Saved products"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-cantaloupe-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Notifications Shortcut */}
            <Link
              to="/notifications"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cantaloupe-500 ring-2 ring-midnight animate-pulse" />
              )}
            </Link>

            {/* Direct Admin Dashboard Link */}
            <Link
              to="/admin"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-electric-500/20 hover:bg-electric-500 text-electric-300 hover:text-white border border-electric-400/30 text-[10px] font-bold uppercase tracking-wider transition-all shadow-glow ml-1"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 overflow-hidden pr-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-display text-sm font-semibold text-white tracking-tight truncate">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Share button on detail views */}
            {(location.pathname.startsWith('/products/') ||
              location.pathname.startsWith('/solutions/') ||
              location.pathname.startsWith('/projects/')) && (
              <button
                type="button"
                onClick={handleShare}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                aria-label="Share page"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setGlobalSearchOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </header>
  );
}

