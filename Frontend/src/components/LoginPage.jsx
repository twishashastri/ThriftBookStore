import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => { setEmail(''); setPassword(''); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setErr('Please enter email and password.');
    setErr(''); setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) return setErr(res.error);
    const u = res.user;
    if (u.role === 'seller') nav('/seller');
    else if (u.role === 'admin') nav('/admin');
    else nav('/buyer');
  };

  return (
    <section className="auth">
      <div className="auth__panel">
        <header className="auth__head">
          <h1>Welcome back</h1>
          <p>Sign in to manage your orders and listings.</p>
        </header>

        <form onSubmit={onSubmit} className="auth__form" autoComplete="off">
          <div className="auth__field">
            <label>Email</label>
            <input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
            />
          </div>

          <div className="auth__field auth__field--password">
            <label>Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {err && <div className="auth__error">{err}</div>}

          <button className="btn btn--primary auth__submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <p className="auth__hint">
            New to ThriftBookStore? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>

      <aside className="auth__aside" aria-hidden="true">
        <div className="auth__aside-inner">
          <h2>ThriftBookStore</h2>
          <h4>"Read more & Spend less"</h4>
          <p>Join thousands of students saving with second-hand books.</p>
        </div>
      </aside>
    </section>
  );
}
