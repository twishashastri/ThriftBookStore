import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  useEffect(() => { setForm({ name: '', email: '', password: '', role: 'buyer' }); }, []);

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate(); if (v) return setErr(v);
    setErr(''); setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.ok) return setErr(res.error);
    alert(res.message || 'Registration successful! Please log in.');
    nav('/login');
  };

  return (
    <section className="auth">
      <div className="auth__panel">
        <header className="auth__head">
          <h1>Create your account</h1>
          <p>Sell and discover pre-loved books with confidence.</p>
        </header>

        <form onSubmit={onSubmit} className="auth__form" autoComplete="off">
          <div className="auth__field">
            <label>Full name</label>
            <input
              placeholder="e.g., Shreya Patel"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="auth__field">
            <label>Email</label>
            <input
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              inputMode="email"
            />
          </div>

          <div className="auth__field auth__field--password">
            <label>Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth__toggle"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="auth__field">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {err && <div className="auth__error">{err}</div>}

          <button className="btn btn--primary auth__submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>

          <p className="auth__hint">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>

      <aside className="auth__aside" aria-hidden="true">
        <div className="auth__aside-inner">
          <h3>ThriftBookStore</h3>
          <p>Quality books. Smarter prices.</p>
        </div>
      </aside>
    </section>
  );
}
