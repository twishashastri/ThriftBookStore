import React from 'react';

// SellerDashboard component for seller users to manage their listings
const SellerDashboard = () => {
  return (
    <div>
      <h2>Seller Dashboard</h2>
      <p>Welcome to your seller dashboard! Here you can manage your book listings.</p>
      <a href="/add-edit-book">Add New Book</a> // Link to add new book
      <a href="/browse">View Your Listings</a> // Link to view current listings
    </div>
  );
};

export default SellerDashboard;
