/**
 * Admin Route Prefetcher
 * Dynamically imports code-split admin page chunks into browser cache
 * on sidebar hover/focus/touch and background idle time.
 */

// Route to module loader map
export const routeLoaders = {
  '/admin': () => import('../pages/DashboardOverviewPage'),
  '/admin/': () => import('../pages/DashboardOverviewPage'),
  '/admin/products': () => import('../pages/ProductsAdminPage'),
  '/admin/categories': () => import('../pages/CategoriesAdminPage'),
  '/admin/solutions': () => import('../pages/SolutionsAdminPage'),
  '/admin/projects': () => import('../pages/ProjectsAdminPage'),
  '/admin/enquiries': () => import('../pages/EnquiriesAdminPage'),
  '/admin/customers': () => import('../pages/CustomersAdminPage'),
  '/admin/users': () => import('../pages/UsersAdminPage'),
  '/admin/notifications': () => import('../pages/NotificationsAdminPage'),
  '/admin/settings': () => import('../pages/SettingsAdminPage'),
};

const prefetchedPaths = new Set();

/**
 * Prefetch a single route chunk if not already loaded
 */
export function prefetchRoute(path) {
  if (!path || prefetchedPaths.has(path)) return;
  const loader = routeLoaders[path];
  if (typeof loader === 'function') {
    prefetchedPaths.add(path);
    loader().catch(() => {
      prefetchedPaths.delete(path); // Retry on future attempt if failed
    });
  }
}

/**
 * Prefetch all admin route chunks in the background during browser idle time
 */
export function prefetchAllAdminRoutes() {
  const paths = Object.keys(routeLoaders);
  paths.forEach((p) => {
    prefetchRoute(p);
  });
}

