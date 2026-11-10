import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialNotifications, initialUserProfile, initialEnquiries } from '../data/demoData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Favorites persisted to localStorage
  const [favorites, setFavorites] = useLocalStorage('solardepot_favorites', ['p1', 'p6']);

  // Comparison list (in-memory per session)
  const [compareList, setCompareList] = useState(['p1', 'p2']);

  // Notifications
  const [notifications, setNotifications] = useLocalStorage('solardepot_notifications', initialNotifications);

  // User Profile
  const [userProfile, setUserProfile] = useLocalStorage('solardepot_profile', initialUserProfile);

  // Demo Enquiries History
  const [enquiries, setEnquiries] = useLocalStorage('solardepot_enquiries', initialEnquiries);

  // Global Search modal state
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  // In-app PDF Viewer Modal state
  const [pdfViewerDoc, setPdfViewerDoc] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Favorites handlers
  const toggleFavorite = useCallback(
    (productId) => {
      setFavorites((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast('Removed from saved items', 'default');
          return prev.filter((id) => id !== productId);
        } else {
          showToast('Added to saved items ❤️', 'success');
          return [...prev, productId];
        }
      });
    },
    [setFavorites, showToast]
  );

  const isFavorite = useCallback(
    (productId) => favorites.includes(productId),
    [favorites]
  );

  // Comparison handlers
  const addToCompare = useCallback(
    (productId) => {
      setCompareList((prev) => {
        if (prev.includes(productId)) {
          showToast('Product already in comparison', 'info');
          return prev;
        }
        if (prev.length >= 4) {
          showToast('Comparison limit reached (max 4 products)', 'warning');
          return prev;
        }
        showToast(`Added to compare (${prev.length + 1}/4)`, 'success');
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const removeFromCompare = useCallback(
    (productId) => {
      setCompareList((prev) => {
        const updated = prev.filter((id) => id !== productId);
        showToast('Removed from comparison', 'default');
        return updated;
      });
    },
    [showToast]
  );

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast('Comparison cleared', 'default');
  }, [showToast]);

  const isInCompare = useCallback(
    (productId) => compareList.includes(productId),
    [compareList]
  );

  // Notification handlers
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback(
    (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    },
    [setNotifications]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'info');
  }, [setNotifications, showToast]);

  // Profile update
  const updateUserProfile = useCallback(
    (updatedFields) => {
      setUserProfile((prev) => ({ ...prev, ...updatedFields }));
      showToast('Profile updated successfully', 'success');
    },
    [setUserProfile, showToast]
  );

  // Enquiry submission (frontend simulation)
  const submitEnquiry = useCallback(
    (enquiryData) => {
      const newId = `SDQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord = {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        type: enquiryData.enquiryType,
        productOrSolution: enquiryData.productOrSolution || 'General Consultation',
        capacity: enquiryData.capacity || 'Not specified',
        quantity: enquiryData.quantity || '1',
        projectType: enquiryData.projectType || 'Standard',
        status: 'Submitted (Demo)',
        statusColor: 'electric',
        notes: enquiryData.message,
        estimatedResponse: 'Under review by Tech Support',
        contact: {
          name: `${enquiryData.firstName} ${enquiryData.lastName}`,
          email: enquiryData.email,
          phone: enquiryData.phone,
        },
      };

      setEnquiries((prev) => [newRecord, ...prev]);

      // Also create a demo notification for the user
      const notif = {
        id: `n-${Date.now()}`,
        title: `Enquiry ${newId} Received`,
        body: `We have received your demo enquiry for ${newRecord.productOrSolution}. Our engineering desk will follow up.`,
        time: 'Just now',
        unread: true,
        type: 'quote',
        targetRoute: '/my-enquiries',
      };
      setNotifications((prev) => [notif, ...prev]);

      return newRecord;
    },
    [setEnquiries, setNotifications]
  );

  // PDF Preview modal handlers
  const openPdfViewer = useCallback((doc) => {
    setPdfViewerDoc(doc);
  }, []);

  const closePdfViewer = useCallback(() => {
    setPdfViewerDoc(null);
  }, []);

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userProfile,
    updateUserProfile,
    enquiries,
    submitEnquiry,
    toast,
    showToast,
    hideToast,
    globalSearchOpen,
    setGlobalSearchOpen,
    pdfViewerDoc,
    openPdfViewer,
    closePdfViewer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

