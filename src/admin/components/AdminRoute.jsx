import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import PageLoader from './PageLoader';

export default function AdminRoute({ children }) {
  const { adminUser, isLoadingAuth } = useAdmin();
  const location = useLocation();

  if (isLoadingAuth) {
    return <PageLoader fullScreen={true} message="Verifying administrative credentials..." />;
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

