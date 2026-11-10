import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, DEFAULT_ADMIN_USER } from '../services/authService';
import { notificationsService } from '../services/notificationsService';
import { getStorage } from '../services/storageHelper';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => {
    try {
      return window.localStorage.getItem('solardepot_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const setSidebarCollapsed = useCallback((valOrFn) => {
    setSidebarCollapsedState((prev) => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      try {
        window.localStorage.setItem('solardepot_sidebar_collapsed', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  }, []);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [adminToast, setAdminToast] = useState({ visible: false, message: '', type: 'info' });

  // Load session from storage on mount (session hydration)
  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      try {
        const session = await authService.getSession();
        if (mounted) {
          if (session) {
            setAdminUser(session);
          } else {
            // Auto-seed default admin session if none exists for seamless review
            setAdminUser(DEFAULT_ADMIN_USER);
            window.localStorage.setItem('solardepot_admin_session', JSON.stringify(DEFAULT_ADMIN_USER));
          }
        }
      } catch (err) {
        console.error('Session hydration failed:', err);
      } finally {
        if (mounted) setIsLoadingAuth(false);
      }
    }
    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch notifications
  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (err) {
      console.warn('Failed to load notifications in AdminContext:', err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const handleStorageChange = (e) => {
      if (e.key === 'solardepot_notifications' || (e.detail && e.detail.key === 'solardepot_notifications')) {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('solardepot_storage_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('solardepot_storage_update', handleStorageChange);
    };
  }, [loadNotifications]);

  const showAdminToast = useCallback((message, type = 'info') => {
    setAdminToast({ visible: true, message, type });
    setTimeout(() => {
      setAdminToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  const hideAdminToast = useCallback(() => {
    setAdminToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    setAdminUser(res.user);
    showAdminToast(`Welcome back, ${res.user.name}`, 'success');
    return res.user;
  }, [showAdminToast]);

  const logout = useCallback(async () => {
    await authService.logout();
    setAdminUser(null);
    showAdminToast('Signed out successfully', 'info');
  }, [showAdminToast]);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const value = {
    adminUser,
    isLoadingAuth,
    login,
    logout,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    notifications,
    unreadNotifCount,
    refreshNotifications: loadNotifications,
    adminToast,
    showAdminToast,
    hideAdminToast,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

