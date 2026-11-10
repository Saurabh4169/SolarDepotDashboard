import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Layers,
  Cpu,
  FolderKanban,
  MessageSquareQuote,
  Building2,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAdmin } from '../context/AdminContext';
import { prefetchRoute } from '../utils/prefetch';

export default function AdminSidebar() {
  const {
    adminUser,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    unreadNotifCount,
  } = useAdmin();

  const navScrollRef = useRef(null);

  // Restore sidebar scroll position across navigation
  useEffect(() => {
    const saved = sessionStorage.getItem('solardepot_sidebar_scroll');
    if (saved && navScrollRef.current) {
      navScrollRef.current.scrollTop = Number(saved);
    }
  }, []);

  const navSections = [
    {
      title: 'STOREFRONT MANAGEMENT',
      items: [
        { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Products', path: '/admin/products', icon: Zap },
        { label: 'Categories', path: '/admin/categories', icon: Layers },
        { label: 'Solutions', path: '/admin/solutions', icon: Cpu },
        { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
      ],
    },
    {
      title: 'SALES',
      items: [
        { label: 'Enquiries & Quotes', path: '/admin/enquiries', icon: MessageSquareQuote },
        { label: 'Customers', path: '/admin/customers', icon: Building2 },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Admin', path: '/admin/users', icon: Users },
        {
          label: 'Notifications',
          path: '/admin/notifications',
          icon: Bell,
          badge: unreadNotifCount > 0 ? unreadNotifCount : null,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [{ label: 'Settings', path: '/admin/settings', icon: Settings }],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Glossy Gradient Sidebar */}
      <aside
        style={{
          background: 'linear-gradient(180deg, #02070A 0%, #071B2A 40%, #0b2f4a 75%, #0278b8 100%)',
        }}
        className={`
          fixed lg:relative top-0 bottom-0 left-0 lg:top-auto lg:bottom-auto lg:left-auto z-50 lg:z-20
          h-full shrink-0
          border-r border-white/[0.08] text-white flex flex-col justify-between
          transition-all duration-300 ease-in-out select-none shadow-soft-lg
          overflow-hidden
          ${mobileSidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-[76px]' : 'lg:w-[280px]'}
        `}
      >
        {/* Soft Glossy Highlight Overlays: Cantaloupe top-left & Electric bottom-left */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at top left, rgba(252, 115, 77, 0.08) 0%, transparent 60%),
              radial-gradient(circle at bottom left, rgba(2, 151, 222, 0.22) 0%, transparent 60%)
            `,
          }}
        />

        {/* Content Container (above glossy background) */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top Logo Bar */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <Logo size="sm" light={true} linkTo="/admin" />
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Navigation List */}
          <div
            ref={navScrollRef}
            onScroll={(e) => {
              sessionStorage.setItem('solardepot_sidebar_scroll', String(e.currentTarget.scrollTop));
            }}
            className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 custom-scrollbar"
          >
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {/* Section Title */}
                {!sidebarCollapsed ? (
                  <h4 className="px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 mb-2">
                    {section.title}
                  </h4>
                ) : (
                  <div className="h-px bg-white/[0.08] my-3 mx-2" />
                )}

                {/* Nav Items */}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={Boolean(item.exact)}
                      onClick={() => setMobileSidebarOpen(false)}
                      onMouseEnter={() => prefetchRoute(item.path)}
                      onFocus={() => prefetchRoute(item.path)}
                      onTouchStart={() => prefetchRoute(item.path)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) => `
                        group relative flex items-center gap-3 px-3.5 h-[44px] rounded-[12px] text-[15px] font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? 'glass-dark !border-electric-500/40 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_0_15px_-3px_rgba(2,151,222,0.3)]'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                        }
                        ${sidebarCollapsed ? 'justify-center px-0' : ''}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-5 h-5 shrink-0 transition-colors ${
                              isActive ? 'text-electric-400' : 'text-slate-300 group-hover:text-electric-400'
                            }`}
                          />

                          {!sidebarCollapsed && (
                            <span className="flex-1 truncate">{item.label}</span>
                          )}

                          {!sidebarCollapsed && !isActive && item.badge && (
                            <span className="px-2 py-0.5 text-[12px] font-semibold rounded-full bg-gradient-to-r from-cantaloupe-400 to-cantaloupe-600 text-white shrink-0 ml-auto shadow-orange">
                              {item.badge}
                            </span>
                          )}

                          {sidebarCollapsed && item.badge && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cantaloupe-500" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom User Card with Collapse Chevron */}
          <div className="p-3.5 border-t border-white/[0.08] shrink-0">
            <div
              className={`
                flex items-center justify-between p-2.5 rounded-xl glass-dark border border-white/[0.12]
                ${sidebarCollapsed ? 'flex-col gap-2 p-2' : ''}
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={
                      adminUser?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={adminUser?.name || 'Admin'}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-electric-500/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-navy" />
                </div>

                {!sidebarCollapsed && (
                  <div className="min-w-0 leading-tight">
                    <div className="text-[14px] font-semibold text-white truncate">
                      {adminUser?.name || 'Admin User'}
                    </div>
                    <div className="text-[12px] text-slate-300 truncate mt-0.5">
                      {adminUser?.role || 'Super Admin'}
                    </div>
                  </div>
                )}
              </div>

              {/* Collapse Chevron Button on Desktop */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-electric-300" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
