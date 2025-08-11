import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [isReady, setIsReady] = useState(false);

  // hydrate on refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setIsReady(true); return; }
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null);
      } finally { setIsReady(true); }
    })();
  }, []);

  // NO AUTO-LOGIN on register: just call API and return message
  const register = async ({ name, email, password, role, username }) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email: String(email || '').toLowerCase(),
        password,
        role,
        username, // ignored by backend if not used
      });
      return { ok: true, message: data.message || 'Registration successful.' };
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      return { ok: false, error: msg };
    }
  };

  // Login: set token + user
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: String(email || '').toLowerCase(),
        password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 400 ? 'Invalid email or password.' : 'Login failed. Please try again.');
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthCtx.Provider value={{ user, isReady, register, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
