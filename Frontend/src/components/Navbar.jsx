import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <h2 style={{ display: 'inline', marginRight: '2rem' }}>ThriftBookStore</h2>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/browse" style={{ marginRight: '1rem' }}>Browse</Link>
      <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
};

export default Navbar;
