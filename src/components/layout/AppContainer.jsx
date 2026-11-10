import React, { useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Smartphone } from 'lucide-react';
import AppHeader from './AppHeader';
import BottomNavigation from './BottomNavigation';
import Toast from '../common/Toast';
import GlobalSearchModal from './GlobalSearchModal';
import PdfViewerModal from './PdfViewerModal';

export default function AppContainer({ children }) {
  const contentRef = useRef(null);
  const location = useLocation();

  // Reset scroll to top on page change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#F8FAFC] sm:bg-[#03070b] flex flex-col items-center justify-start sm:justify-center sm:p-4 md:p-6 sm:overflow-y-auto relative">
      {/* Ambient background lighting on desktop */}
      <div className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-cantaloupe-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Desktop Portal Switcher Pill */}
      <div className="hidden sm:flex items-center gap-2 mb-3 px-3 py-1.5 rounded-2xl bg-midnight-100/90 border border-electric-500/30 backdrop-blur-md shadow-glow z-20">
        <span className="text-[11px] font-semibold text-slate-400">View:</span>
        <span className="px-2.5 py-1 rounded-xl bg-cantaloupe-500 text-white text-xs font-bold shadow-orange flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile App</span>
        </span>
        <Link
          to="/admin"
          className="px-2.5 py-1 rounded-xl bg-electric-500/15 text-electric-300 hover:bg-electric-500 hover:text-white text-xs font-bold transition-all border border-electric-500/30 flex items-center gap-1.5"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Switch to Admin Dashboard →</span>
        </Link>
      </div>

      {/* Mobile Device Frame Container */}
      <div
        className="
          relative w-full h-[100dvh] max-h-[100dvh]
          sm:h-[min(844px,92vh)] sm:max-h-[844px] sm:w-[390px] sm:max-w-[390px]
          bg-offwhite text-navy flex flex-col overflow-hidden
          rounded-none sm:rounded-phone
          shadow-none sm:shadow-phone
          border-0 sm:border-[8px] sm:border-[#10202d] sm:ring-1 sm:ring-white/10
        "
      >
        {/* Global Toast Notification */}
        <Toast />

        {/* Top App Header */}
        <AppHeader />

        {/* Scrollable Main Content Area */}
        <main
          ref={contentRef}
          className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#F8FAFC] flex flex-col overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNavigation />

        {/* Search Modal */}
        <GlobalSearchModal />

        {/* Document Viewer Modal */}
        <PdfViewerModal />
      </div>
    </div>
  );
}

