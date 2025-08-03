import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BrowseBooks from './BrowseBooks';
import AddEditBook from './AddEditBook';
import Cart from './Cart';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import AdminDashboard from './AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/browse" element={<BrowseBooks />} />
      <Route path="/add-edit-book" element={<AddEditBook />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
