import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './HomePage';
import BrowseBooks from './BrowseBooks';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Cart from './Cart';
import Checkout from './Checkout'; 
import SellerDashboard from './SellerDashboard';
import BuyerDashboard from './BuyerDashboard';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import AuthProvider from './AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Home as default */}
          <Route path="/" element={<HomePage />} />

          {/* Public pages */}
          <Route path="/browse" element={<BrowseBooks />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected pages */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={['buyer', 'admin']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"   // ← ADD THIS ROUTE
            element={
              <ProtectedRoute roles={['buyer', 'admin']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller"
            element={
              <ProtectedRoute roles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer"
            element={
              <ProtectedRoute roles={['buyer', 'admin']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}
