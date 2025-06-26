import React from 'react';

// BuyerDashboard component for buyer users to manage their account
const BuyerDashboard = () => {
  return (
    <div>
      <h2>Buyer Dashboard</h2>
      <p>Welcome to your dashboard! Here you can view your orders and manage your account.</p>
      <a href="/browse">Browse Books</a> // Link to browse books
      <a href="/cart">View Cart</a> // Link to view shopping cart
    </div>
  );
};

export default BuyerDashboard;
