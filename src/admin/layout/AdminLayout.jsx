import React, { Suspense, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminPageSkeleton } from '../components/Skeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import AdminToast from '../components/AdminToast';
import { useAdminData } from '../context/AdminDataContext';
import { prefetchAllAdminRoutes } from '../utils/prefetch';

export default function AdminLayout() {
  const location = useLocation();
  const mainContentRef = useRef(null);
  const { isTransitionPending } = useAdminData();

  // Reset content area scroll to top instantly on route change (without scrolling window)
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  // Prefetch all admin route code chunks in the background during idle time after dashboard load
  useEffect(() => {
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => prefetchAllAdminRoutes(), { timeout: 2000 });
      } else {
        setTimeout(() => prefetchAllAdminRoutes(), 1000);
      }
    };
    schedule();
  }, []);

  return (
    <div className="admin-shell fixed inset-0 w-full h-full min-h-[100dvh] bg-[#F7FAFC] flex overflow-hidden z-30 font-sans text-navy">
      {/* Toast Feedback notifications */}
      <AdminToast />

      {/* Navigation Sidebar: Never unmounts or jumps across route changes */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#F7FAFC] relative">
        {/* Sleek electric progress bar active only during pending transitions */}
        {isTransitionPending && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-electric-400 via-cantaloupe-500 to-electric-600 animate-pulse z-40 pointer-events-none" />
        )}

        {/* Top Header with instant breadcrumbs */}
        <AdminHeader />

        {/* Scrollable Viewport Content: Dedicated container scroll with instant reset */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 bg-[#F7FAFC] flex flex-col">
          <div className="w-full max-w-[1600px] mx-auto flex-1 flex flex-col">
            <ErrorBoundary>
              {/* Suspense is strictly scoped to the content area using realistic layout skeleton */}
              <Suspense fallback={<AdminPageSkeleton />}>
                <div key={location.pathname} className="admin-page-transition flex-1 flex flex-col">
                  <Outlet />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
