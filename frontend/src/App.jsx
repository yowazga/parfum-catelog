import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext';
import NotificationToast from './components/NotificationToast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CategoryManagement from './pages/CategoryManagement';
import BrandManagement from './pages/BrandManagement';
import PerfumeManagement from './pages/PerfumeManagement';
import ImageManagement from './pages/ImageManagement';
import UserManagement from './pages/UserManagement';
import Home from './pages/Home';

import './index.css';

function App() {
  return (
    <DataProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <NotificationToast />
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute>
                  <CategoryManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories/:categoryId/brands" element={
                <ProtectedRoute>
                  <BrandManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/brands" element={
                <ProtectedRoute>
                  <BrandManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/brands/:brandId/perfumes" element={
                <ProtectedRoute>
                  <PerfumeManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/perfumes" element={
                <ProtectedRoute>
                  <PerfumeManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/images" element={
                <ProtectedRoute>
                  <ImageManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
    </DataProvider>
  );
}

export default App;
