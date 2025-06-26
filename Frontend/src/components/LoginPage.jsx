import React, { useState } from 'react';
import axios from 'axios';

// LoginPage component for user authentication
const LoginPage = () => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      // Store token in local storage for future requests
      localStorage.setItem('token', response.data.token);
      alert('Login successful!'); // Notify user of success
      window.location.href = '/buyer-dashboard'; // Redirect to buyer dashboard
    } catch (error) {
      alert('Login failed!'); // Notify user of failure
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
