import React from 'react';

// AdminDashboard component for admin users to manage the platform
const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard! Here you can manage users and oversee the platform.</p>
      <a href="/manage-users">Manage Users</a> // Link to manage users
      <a href="/view-reports">View Reports</a> // Link to view platform reports
    </div>
  );
};

export default AdminDashboard;
