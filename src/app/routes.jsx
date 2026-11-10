import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
