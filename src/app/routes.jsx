import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from '../admin/components/AdminRoute';
import AdminLayout from '../admin/layout/AdminLayout';
import PageLoader from '../admin/components/PageLoader';

// Lazy-loaded Admin Pages
const DashboardOverviewPage = lazy(() => import('../admin/pages/DashboardOverviewPage'));
const ProductsAdminPage = lazy(() => import('../admin/pages/ProductsAdminPage'));
const CategoriesAdminPage = lazy(() => import('../admin/pages/CategoriesAdminPage'));
const SolutionsAdminPage = lazy(() => import('../admin/pages/SolutionsAdminPage'));
const ProjectsAdminPage = lazy(() => import('../admin/pages/ProjectsAdminPage'));
const DownloadsAdminPage = lazy(() => import('../admin/pages/DownloadsAdminPage'));
const EnquiriesAdminPage = lazy(() => import('../admin/pages/EnquiriesAdminPage'));
const CustomersAdminPage = lazy(() => import('../admin/pages/CustomersAdminPage'));
const UsersAdminPage = lazy(() => import('../admin/pages/UsersAdminPage'));
const NotificationsAdminPage = lazy(() => import('../admin/pages/NotificationsAdminPage'));
const SettingsAdminPage = lazy(() => import('../admin/pages/SettingsAdminPage'));
const AdminLoginPage = lazy(() => import('../admin/pages/AdminLoginPage'));

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
        <Route path="downloads" element={<DownloadsAdminPage />} />
        <Route path="enquiries" element={<EnquiriesAdminPage />} />
        <Route path="customers" element={<CustomersAdminPage />} />
        <Route path="users" element={<UsersAdminPage />} />
        <Route path="notifications" element={<NotificationsAdminPage />} />
        <Route path="settings" element={<SettingsAdminPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Direct alias redirects so typing /products, /categories etc. routes to their admin dashboard view */}
      <Route path="/products" element={<Navigate to="/admin/products" replace />} />
      <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />
      <Route path="/solutions" element={<Navigate to="/admin/solutions" replace />} />
      <Route path="/projects" element={<Navigate to="/admin/projects" replace />} />
      <Route path="/downloads" element={<Navigate to="/admin/downloads" replace />} />
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
