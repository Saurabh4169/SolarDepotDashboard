import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { productsService } from '../services/productsService';
import { categoriesService } from '../services/categoriesService';
import { solutionsService } from '../services/solutionsService';
import { projectsService } from '../services/projectsService';
import { enquiriesService } from '../services/enquiriesService';
import { customersService } from '../services/customersService';
import { usersService } from '../services/usersService';
import { notificationsService } from '../services/notificationsService';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  // In-memory data store for all admin entities (stale-while-revalidate cache)
  const cacheRef = useRef({
    products: null,
    categories: null,
    solutions: null,
    projects: null,
    enquiries: null,
    customers: null,
    users: null,
    notifications: null,
  });

  // In-memory per-page filter, search, sort, and pagination state
  const pageStateRef = useRef({});

  // Listeners for data updates
  const [, setVersion] = useState(0);
  const notifyUpdate = useCallback(() => setVersion((v) => v + 1), []);

  // useTransition for instant concurrent navigation without screen blanking
  const [isPending, startTransition] = useTransition();

  // Pre-hydrate all administrative datasets on layout mount
  useEffect(() => {
    let isCancelled = false;

    async function prefetchAdminDatasets() {
      try {
        const [
          productsRes,
          categoriesRes,
          solutionsRes,
          projectsRes,
          enquiriesRes,
          customersRes,
          usersRes,
          notificationsRes,
        ] = await Promise.allSettled([
          productsService.getAll({ page: 1, limit: 100 }),
          categoriesService.getAll(),
          solutionsService.getAll({ page: 1, limit: 100 }),
          projectsService.getAll({ page: 1, limit: 100 }),
          enquiriesService.getAll({ page: 1, limit: 100 }),
          customersService.getAll({ page: 1, limit: 100 }),
          usersService.getAll({ page: 1, limit: 100 }),
          notificationsService.getAll({ page: 1, limit: 100 }),
        ]);

        if (isCancelled) return;

        if (productsRes.status === 'fulfilled') cacheRef.current.products = productsRes.value;
        if (categoriesRes.status === 'fulfilled') cacheRef.current.categories = categoriesRes.value;
        if (solutionsRes.status === 'fulfilled') cacheRef.current.solutions = solutionsRes.value;
        if (projectsRes.status === 'fulfilled') cacheRef.current.projects = projectsRes.value;
        if (enquiriesRes.status === 'fulfilled') cacheRef.current.enquiries = enquiriesRes.value;
        if (customersRes.status === 'fulfilled') cacheRef.current.customers = customersRes.value;
        if (usersRes.status === 'fulfilled') cacheRef.current.users = usersRes.value;
        if (notificationsRes.status === 'fulfilled') cacheRef.current.notifications = notificationsRes.value;

        notifyUpdate();
      } catch (err) {
        console.warn('Background admin dataset hydration error:', err);
      }
    }

    prefetchAdminDatasets();

    // Listen to localStorage changes from client mobile app or other tabs
    const handleStorage = (e) => {
      if (
        e.key &&
        (e.key.startsWith('solardepot_') || e.key.includes('admin') || e.key.includes('enquiries'))
      ) {
        // Revalidate affected cache in the background without remount
        prefetchAdminDatasets();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('solardepot:storage_sync', prefetchAdminDatasets);

    return () => {
      isCancelled = true;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('solardepot:storage_sync', prefetchAdminDatasets);
    };
  }, [notifyUpdate]);

  // Read cached data immediately
  const getCachedData = useCallback((key) => {
    return cacheRef.current[key] || null;
  }, []);

  // Update cached data
  const setCachedData = useCallback(
    (key, data) => {
      cacheRef.current[key] = data;
      notifyUpdate();
    },
    [notifyUpdate]
  );

  // Invalidate cached data to force background refresh
  const invalidateData = useCallback(
    (key) => {
      cacheRef.current[key] = null;
      notifyUpdate();
    },
    [notifyUpdate]
  );

  // Get preserved state for a specific page (search, filters, sort, page)
  const getPageState = useCallback((pageKey, defaultState = {}) => {
    if (!pageStateRef.current[pageKey]) {
      pageStateRef.current[pageKey] = { ...defaultState };
    }
    return pageStateRef.current[pageKey];
  }, []);

  // Update preserved state for a specific page
  const setPageState = useCallback((pageKey, partialOrUpdater) => {
    const current = pageStateRef.current[pageKey] || {};
    const next =
      typeof partialOrUpdater === 'function'
        ? partialOrUpdater(current)
        : { ...current, ...partialOrUpdater };
    pageStateRef.current[pageKey] = next;
  }, []);

  const value = {
    getCachedData,
    setCachedData,
    invalidateData,
    getPageState,
    setPageState,
    isTransitionPending: isPending,
    startPageTransition: startTransition,
  };

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}

