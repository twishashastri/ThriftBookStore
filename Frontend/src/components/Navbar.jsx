import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="nav container">
      <Link to="/">ThriftBookStore</Link>
      <div className="spacer" />
      <Link to="/browse">Browse</Link>
      {user?.role === 'buyer' && <Link to="/cart">Cart</Link>}
      {user?.role === 'seller' && <Link to="/seller">Seller</Link>}
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}

      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <button onClick={() => { logout(); nav('/'); }}>Logout</button>
      )}
    </nav>
  );
}
