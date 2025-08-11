import React, { useEffect, useState } from 'react';
import api from './api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: '—', books: 0, orders: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ordersRes, booksRes, usersCountRes] = await Promise.all([
          api.get('/orders'),
          api.get('/books'),
          api.get('/users/count'), // admin-only
        ]);

        setOrders(ordersRes.data || []);
        setStats({
          users: usersCountRes?.data?.count ?? '—',
          books: (booksRes.data || []).length,
          orders: (ordersRes.data || []).length,
        });
      } catch (err) {
        // If not admin / not logged in, keep the users tile as —
        console.warn('Users count failed:', err?.response?.status, err?.response?.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatCurrency = (n) =>
    typeof n === 'number'
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
      : '—';

  const formatDate = (d) => {
    const dt = d ? new Date(d) : null;
    return dt && !isNaN(dt)
      ? dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '—';
  };

  const statusBadge = (s) => {
    const k = String(s || '').toLowerCase();
    if (k.includes('paid') || k.includes('completed')) return 'badge badge--success';
    if (k.includes('pending') || k.includes('processing')) return 'badge badge--warn';
    if (k.includes('cancel') || k.includes('failed')) return 'badge badge--danger';
    return 'badge';
  };

  return (
    <div className="admin">
      <header className="admin__head">
        <h2>Admin Dashboard</h2>
        <p className="muted">Overview of marketplace activity at a glance.</p>
      </header>

      <section className="stats grid">
        <div className="stat card">
          <div className="stat__label">Users</div>
          <div className="stat__value">{stats.users}</div>
        </div>
        <div className="stat card">
          <div className="stat__label">Books</div>
          <div className="stat__value">{stats.books}</div>
        </div>
        <div className="stat card">
          <div className="stat__label">Orders</div>
          <div className="stat__value">{stats.orders}</div>
        </div>
      </section>

      <section className="card admin__section">
        <div className="admin__section-head">
          <h3>Recent Orders</h3>
          <span className="muted">last 5 shown</span>
        </div>

        {loading ? (
          <div className="table table--skeleton">
            <div className="sk-row" /><div className="sk-row" /><div className="sk-row" />
          </div>
        ) : orders.length === 0 ? (
          <div className="empty"><p>No orders yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th><th>Buyer</th><th>Total</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o._id}>
                    <td className="mono">#{(o._id || '').slice(-6)}</td>
                    <td>{o.buyer?.name || o.user?.name || '—'}</td>
                    <td>{formatCurrency(o.total || o.amount)}</td>
                    <td><span className={statusBadge(o.status)}>{o.status || '—'}</span></td>
                    <td>{formatDate(o.createdAt || o.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
