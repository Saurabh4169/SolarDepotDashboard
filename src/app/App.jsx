import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { AdminProvider } from '../admin/context/AdminContext';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AdminProvider>
          <AppRoutes />
        </AdminProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
