import React from 'react';

// HomePage component that serves as the landing page for users
const HomePage = () => {
  return (
    <div>
      <h1>Welcome to ThriftBookStore!</h1>
      <p>Your one-stop shop for buying and selling books.</p>
      <a href="/browse">Browse Books</a> // Link to browse available books
    </div>
  );
};

export default HomePage;
