import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ChevronRight,
  FileText,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function AdminHeader() {
  const {
    adminUser,
    logout,
    notifications,
    unreadNotifCount,
    setMobileSidebarOpen,
  } = useAdmin();

  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumb = (pathname) => {
    if (pathname === '/admin' || pathname === '/admin/') {
      return { parent: 'Dashboard', current: 'Overview' };
    }
    if (pathname.startsWith('/admin/products')) {
      return { parent: 'Dashboard', current: 'Products' };
    }
    if (pathname.startsWith('/admin/categories')) {
      return { parent: 'Dashboard', current: 'Categories' };
    }
    if (pathname.startsWith('/admin/solutions')) {
      return { parent: 'Dashboard', current: 'Solutions' };
    }
    if (pathname.startsWith('/admin/projects')) {
      return { parent: 'Dashboard', current: 'Projects' };
    }
    if (pathname.startsWith('/admin/enquiries')) {
      return { parent: 'Dashboard', current: 'Enquiries & Quotes' };
    }
    if (pathname.startsWith('/admin/customers')) {
      return { parent: 'Dashboard', current: 'Customers' };
    }
    if (pathname.startsWith('/admin/users')) {
      return { parent: 'Dashboard', current: 'Admin' };
    }
    if (pathname.startsWith('/admin/notifications')) {
      return { parent: 'Dashboard', current: 'Notifications' };
    }
    if (pathname.startsWith('/admin/settings')) {
      return { parent: 'Dashboard', current: 'Settings' };
    }
    return { parent: 'Dashboard', current: 'Overview' };
  };

  const breadcrumb = getBreadcrumb(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-[#0297DE]/12 shrink-0 select-none z-20 relative">
      {/* Cantaloupe to transparent glowing line at bottom edge (matching mobile app header) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-cantaloupe-500/80 via-cantaloupe-400/40 to-transparent pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumbs (Highlander style: Dashboard / Products) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:text-navy hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-[13px] font-medium" aria-label="Breadcrumb">
          <Link
            to="/admin"
            className="text-slate-500 hover:text-navy transition-colors font-medium"
          >
            {breadcrumb.parent}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="text-navy font-semibold">
            {breadcrumb.current}
          </span>
        </nav>
      </div>

      {/* Right Controls: Notification Bell with Badge & User Menu */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-cantaloupe-400 to-cantaloupe-600 text-white text-[10px] font-bold flex items-center justify-center shadow-orange">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-soft-lg border border-[#0297DE]/18 overflow-hidden z-50 animate-fade-in">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[14px] font-bold text-navy">Notifications</span>
                  {unreadNotifCount > 0 && (
                    <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-cantaloupe-400/15 to-cantaloupe-600/15 text-cantaloupe-600 border border-cantaloupe-200">
                      {unreadNotifCount} unread
                    </span>
                  )}
                </div>
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[13px] text-electric hover:text-electric-600 font-semibold"
                >
                  Manage All
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[13px] text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                        n.unread ? 'bg-electric-50/30' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-iceblue border border-[#0297DE]/20 flex items-center justify-center shrink-0 text-electric-600 mt-0.5">
                        {n.type === 'quote' ? (
                          <FileText className="w-4 h-4" />
                        ) : n.type === 'product' ? (
                          <Package className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-navy truncate">
                          {n.title}
                        </p>
                        <p className="text-[12px] text-slate-500 line-clamp-2 mt-0.5">
                          {n.body}
                        </p>
                        <span className="text-[12px] text-slate-400 mt-1 block tabular-nums">
                          {n.time || 'Recently'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50">
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-[13px] font-medium text-slate-600 hover:text-navy"
                >
                  Broadcast new notification →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="relative">
              <img
                src={
                  adminUser?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={adminUser?.name || 'Admin'}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-electric-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden sm:block leading-tight">
              <div className="text-[14px] font-semibold text-navy truncate max-w-[130px]">
                {adminUser?.name || 'Admin User'}
              </div>
              <div className="text-[12px] text-slate-500 font-medium truncate">
                {adminUser?.role || 'Super Admin'}
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-[#0297DE]/15 p-2 z-50 animate-fade-in space-y-1">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[14px] font-semibold text-navy truncate">{adminUser?.name}</p>
                <p className="text-[12px] text-slate-400 truncate tabular-nums">{adminUser?.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[12px] font-semibold bg-electric-50 text-electric-700 border border-electric-200">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>

              <Link
                to="/admin/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-700 hover:text-navy hover:bg-slate-50 rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Admin Profile</span>
              </Link>

              <Link
                to="/admin/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-700 hover:text-navy hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>System Settings</span>
              </Link>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
}
