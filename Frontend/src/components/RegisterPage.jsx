import React, { useState } from 'react';
import axios from 'axios';

// RegisterPage component for new user registration
const RegisterPage = () => {
  const [username, setUsername] = useState(''); // State for username input
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.post('/api/auth/register', { username, email, password });
      alert('Registration successful!'); // Notify user of success
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      alert('Registration failed!'); // Notify user of failure
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
