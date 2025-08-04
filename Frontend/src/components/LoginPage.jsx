import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, role, username } = res.data;

      // Optional: Store token in localStorage or sessionStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);

      alert(` Welcome ${username}! Redirecting to your dashboard...`);

      // Redirect based on role
      if (role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else if (role === 'seller') {
        window.location.href = '/seller-dashboard';
      } else {
        window.location.href = '/buyer-dashboard';
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert(`Login failed: ${error.response?.data?.message || 'Invalid credentials'}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome</h1>
        <p style={styles.subheading}>Login to your account</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <a href="/register" style={styles.link}>Register</a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7f7f7',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '10px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
  },
  subheading: {
    marginBottom: '30px',
    color: '#666',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  footerText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default LoginPage;
