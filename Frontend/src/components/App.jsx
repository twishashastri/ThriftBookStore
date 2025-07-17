import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BrowseBooks from './BrowseBooks';
import AddEditBook from './AddEditBook';
import Cart from './Cart';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import AdminDashboard from './AdminDashboard';

// Main App component that sets up routing for the application
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact component={HomePage} /> // Home page route
        <Route path="/login" component={LoginPage} /> // Login page route
        <Route path="/register" component={RegisterPage} /> // Registration page route
        <Route path="/browse" component={BrowseBooks} /> // Route to browse books
        <Route path="/add-edit-book" component={AddEditBook} /> // Route for adding/editing books
        <Route path="/cart" component={Cart} /> // Shopping cart route
        <Route path="/buyer-dashboard" component={BuyerDashboard} /> // Buyer dashboard route
        <Route path="/seller-dashboard" component={SellerDashboard} /> // Seller dashboard route
        <Route path="/admin-dashboard" component={AdminDashboard} /> // Admin dashboard route
      </Routes>
    </Router>
  );
};

export default App;
