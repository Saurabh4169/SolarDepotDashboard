import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import PageLoader from '../components/PageLoader';
import ErrorBoundary from '../components/ErrorBoundary';
import AdminToast from '../components/AdminToast';

export default function AdminLayout() {
  return (
    <div className="admin-shell fixed inset-0 w-full h-full min-h-[100dvh] bg-[#F7FAFC] flex overflow-hidden z-30 font-sans text-navy">
      {/* Toast Feedback notifications */}
      <AdminToast />

      {/* Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#F7FAFC]">
        {/* Top Header */}
        <AdminHeader />

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 bg-[#F7FAFC]">
          <div className="w-full max-w-[1600px] mx-auto">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader fullScreen={false} message="Loading module view..." />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
