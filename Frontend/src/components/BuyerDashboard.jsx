import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [flash, setFlash] = useState('');

  const money = useMemo(
    () => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }),
    []
  );
  const dateStr = (d) => new Date(d).toLocaleString();

  useEffect(() => {
    // show a one-time success message if we just placed an order
    if (sessionStorage.getItem('justOrdered')) {
      setFlash('Order placed successfully !!');
      sessionStorage.removeItem('justOrdered');
    }

    (async () => {
      try {
        setErr(''); setLoading(true);
        let res;
        try { res = await api.get('/orders/me'); }
        catch { res = await api.get('/orders'); }
        const data = Array.isArray(res.data) ? res.data : [];
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(data);
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalOf = (o) =>
    typeof o.total === 'number'
      ? o.total
      : (o.items || []).reduce((sum, it) => {
          const price = Number(it.price ?? it.book?.price ?? 0);
          const qty = Number(it.qty ?? 1);
          return sum + price * qty;
        }, 0);

  if (loading) {
    return (
      <div className="container page--orders">
        <div className="card">Loading orders…</div>
      </div>
    );
  }

  return (
    <div className="container page--orders">
      <h2>My Orders</h2>

      {flash && <div className="flash flash--success">{flash}</div>}
      {err && <div className="error" style={{ marginBottom: 12 }}>{err}</div>}

      {!orders.length ? (
        <div className="card empty">
          You don’t have any orders yet.{' '}
          <Link to="/browse" className="btn btn--link">Browse books →</Link>
        </div>
      ) : (
        <ul className="orders">
          {orders.map((o) => (
            <li key={o._id} className="card">
              {/* Header */}
              <div>
                <div>
                  <strong>Order #{String(o._id).slice(-6).toUpperCase()}</strong>
                  <span className="muted"> • {dateStr(o.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    className={`badge ${
                      o.status === 'paid' ? 'badge--success'
                      : o.status === 'pending' ? 'badge--warn'
                      : 'badge--danger'
                    }`}
                  >
                    {o.status || 'pending'}
                  </span>
                  <strong style={{ fontSize: 18 }}>{money.format(totalOf(o))}</strong>
                </div>
              </div>

              {/* Items */}
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(o.items || []).map((it, idx) => {
                      const price = Number(it.price ?? it.book?.price ?? 0);
                      const qty = Number(it.qty ?? 1);
                      return (
                        <tr key={idx}>
                          <td>
                            <strong>{it.book?.title || 'Book'}</strong>
                            <div className="muted" style={{ fontSize: 12 }}>
                              {it.book?.author} {it.book?.condition ? `• ${it.book.condition}` : ''}
                            </div>
                          </td>
                          <td>{qty}</td>
                          <td style={{ textAlign: 'right' }}>{money.format(price)}</td>
                          <td style={{ textAlign: 'right' }}>{money.format(price * qty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
