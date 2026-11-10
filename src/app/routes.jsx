import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AdminRoute from '../admin/components/AdminRoute';
import AdminLayout from '../admin/layout/AdminLayout';
import PageLoader from '../admin/components/PageLoader';

// Exported loader functions for instant chunk prefetching
export const loadDashboardOverview = () => import('../admin/pages/DashboardOverviewPage');
export const loadProductsPage = () => import('../admin/pages/ProductsAdminPage');
export const loadCategoriesPage = () => import('../admin/pages/CategoriesAdminPage');
export const loadSolutionsPage = () => import('../admin/pages/SolutionsAdminPage');
export const loadProjectsPage = () => import('../admin/pages/ProjectsAdminPage');
export const loadEnquiriesPage = () => import('../admin/pages/EnquiriesAdminPage');
export const loadCustomersPage = () => import('../admin/pages/CustomersAdminPage');
export const loadUsersPage = () => import('../admin/pages/UsersAdminPage');
export const loadNotificationsPage = () => import('../admin/pages/NotificationsAdminPage');
export const loadSettingsPage = () => import('../admin/pages/SettingsAdminPage');
export const loadLoginPage = () => import('../admin/pages/AdminLoginPage');

// Lazy-loaded Admin Pages using exported loader functions
const DashboardOverviewPage = lazy(loadDashboardOverview);
const ProductsAdminPage = lazy(loadProductsPage);
const CategoriesAdminPage = lazy(loadCategoriesPage);
const SolutionsAdminPage = lazy(loadSolutionsPage);
const ProjectsAdminPage = lazy(loadProjectsPage);
const EnquiriesAdminPage = lazy(loadEnquiriesPage);
const CustomersAdminPage = lazy(loadCustomersPage);
const UsersAdminPage = lazy(loadUsersPage);
const NotificationsAdminPage = lazy(loadNotificationsPage);
const SettingsAdminPage = lazy(loadSettingsPage);
const AdminLoginPage = lazy(loadLoginPage);

// Mobile App Pages
const AppContainer = lazy(() => import('../components/layout/AppContainer'));
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const ProductDetailsPage = lazy(() => import('../pages/Products/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('../pages/Products/CategoriesPage'));
const ComparePage = lazy(() => import('../pages/Products/ComparePage'));
const SavedProductsPage = lazy(() => import('../pages/Saved/SavedProductsPage'));
const SolutionsPage = lazy(() => import('../pages/Solutions/SolutionsPage'));
const SolutionDetailsPage = lazy(() => import('../pages/Solutions/SolutionDetailsPage'));
const ProjectsPage = lazy(() => import('../pages/Projects/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('../pages/Projects/ProjectDetailsPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const MyEnquiriesPage = lazy(() => import('../pages/Enquiries/MyEnquiriesPage'));
const RequestQuotePage = lazy(() => import('../pages/Enquiries/RequestQuotePage'));
const DownloadsPage = lazy(() => import('../pages/Resources/DownloadsPage'));

function MobileAppLayout() {
  return (
    <Suspense fallback={<PageLoader fullScreen={false} message="Loading Solar Depot..." />}>
      <AppContainer>
        <Outlet />
      </AppContainer>
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root path redirects directly to /admin dashboard */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Admin Authentication */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<PageLoader fullScreen={true} message="Loading login portal..." />}>
            <AdminLoginPage />
          </Suspense>
        }
      />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />

      {/* Protected Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="products" element={<ProductsAdminPage />} />
        <Route path="categories" element={<CategoriesAdminPage />} />
        <Route path="solutions" element={<SolutionsAdminPage />} />
        <Route path="projects" element={<ProjectsAdminPage />} />
        {/* Downloads route removed from admin; redirected to /admin */}
        <Route path="downloads" element={<Navigate to="/admin" replace />} />
        <Route path="enquiries" element={<EnquiriesAdminPage />} />
        <Route path="customers" element={<CustomersAdminPage />} />
        <Route path="users" element={<UsersAdminPage />} />
        <Route path="notifications" element={<NotificationsAdminPage />} />
        <Route path="settings" element={<SettingsAdminPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Mobile App Storefront */}
      <Route path="/app" element={<MobileAppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="saved" element={<SavedProductsPage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="solutions/:slug" element={<SolutionDetailsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="my-enquiries" element={<MyEnquiriesPage />} />
        <Route path="quote" element={<RequestQuotePage />} />
        <Route path="downloads" element={<DownloadsPage />} />
      </Route>

      {/* Mobile Aliases & Direct Product Details */}
      <Route path="/mobile" element={<Navigate to="/app" replace />} />
      <Route path="/store" element={<Navigate to="/app" replace />} />
      <Route
        path="/products/:slug"
        element={
          <Suspense fallback={<PageLoader fullScreen={false} message="Loading product..." />}>
            <AppContainer>
              <ProductDetailsPage />
            </AppContainer>
          </Suspense>
        }
      />
      <Route
        path="/compare"
        element={
          <Suspense fallback={<PageLoader fullScreen={false} message="Loading comparison..." />}>
            <AppContainer>
              <ComparePage />
            </AppContainer>
          </Suspense>
        }
      />
      <Route
        path="/saved"
        element={
          <Suspense fallback={<PageLoader fullScreen={false} message="Loading saved..." />}>
            <AppContainer>
              <SavedProductsPage />
            </AppContainer>
          </Suspense>
        }
      />

      {/* Direct alias redirects so typing /products, /categories etc. routes to their admin dashboard view */}
      <Route path="/products" element={<Navigate to="/admin/products" replace />} />
      <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />
      <Route path="/solutions" element={<Navigate to="/admin/solutions" replace />} />
      <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />
      <Route path="/downloads" element={<Navigate to="/admin" replace />} />
      <Route path="/enquiries" element={<Navigate to="/admin/enquiries" replace />} />
      <Route path="/customers" element={<Navigate to="/admin/customers" replace />} />
      <Route path="/users" element={<Navigate to="/admin/users" replace />} />
      <Route path="/notifications" element={<Navigate to="/admin/notifications" replace />} />
      <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

      {/* Typo alias redirects */}
      <Route path="/admins" element={<Navigate to="/admin" replace />} />
      <Route path="/admins/*" element={<Navigate to="/admin" replace />} />

      {/* Global Fallback Catch-all: always navigate to /admin */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
