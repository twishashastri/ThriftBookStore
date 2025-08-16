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
    if (sessionStorage.getItem('justOrdered')) {
      setFlash('Order placed successfully!');
      sessionStorage.removeItem('justOrdered');
    }

    const fetchOrders = async () => {
      try {
        setErr('');
        setLoading(true);

        let res = await api.get('/orders/me');
        const data = Array.isArray(res.data) ? res.data : [];

        // Sort by date
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Remove duplicates
        const uniqueOrders = Array.from(new Map(data.map(o => [o._id, o])).values());
        setOrders(uniqueOrders);
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOf = (order) =>
    typeof order.total === 'number'
      ? order.total
      : (order.items || []).reduce((sum, it) => {
          const price = Number(it.price ?? it.book?.price ?? 0);
          const qty = Number(it.qty ?? 1);
          return sum + price * qty;
        }, 0);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
        <div style={{
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 8,
          backgroundColor: '#fff'
        }}>
          Loading orders…
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <h2>My Orders</h2>

      {flash && (
        <div style={{
          padding: 10,
          marginBottom: 15,
          borderRadius: 5,
          backgroundColor: '#d4edda',
          color: '#155724',
          fontWeight: 'bold'
        }}>
          {flash}
        </div>
      )}

      {err && (
        <div style={{
          padding: 10,
          marginBottom: 15,
          borderRadius: 5,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          fontWeight: 'bold'
        }}>
          {err}
        </div>
      )}

      {!orders.length ? (
        <div style={{
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 8,
          backgroundColor: '#fff',
          textAlign: 'center'
        }}>
          You don’t have any orders yet.{' '}
          <Link to="/browse" style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Browse books →
          </Link>
        </div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {orders.map((o) => (
            <li key={o._id} style={{
              marginBottom: 20,
              padding: 15,
              border: '1px solid #ddd',
              borderRadius: 8,
              backgroundColor: '#fff'
            }}>
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginBottom: 15
              }}>
                <div>
                  <strong>Order #{String(o._id).slice(-6).toUpperCase()}</strong>
                  <span style={{ marginLeft: 10, color: '#666' }}>
                    • {dateStr(o.createdAt)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 12,
                    fontWeight: 'bold',
                    backgroundColor: o.status === 'paid' ? '#d4edda'
                      : o.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    color: o.status === 'paid' ? '#155724'
                      : o.status === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {o.status || 'pending'}
                  </span>
                  <strong>{money.format(totalOf(o))}</strong>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: 10 }}>Item</th>
                      <th style={{ padding: 10 }}>Qty</th>
                      <th style={{ padding: 10, textAlign: 'right' }}>Price</th>
                      <th style={{ padding: 10, textAlign: 'right' }}>Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(o.items && o.items.length > 0) ? o.items.map((it, idx) => {
                      const price = Number(it.price ?? it.book?.price ?? 0);
                      const qty = Number(it.qty ?? 1);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: 10 }}>
                            <strong>{it.book?.title || 'Book'}</strong>
                            <div style={{ fontSize: 12, color: '#666' }}>
                              {it.book?.author} {it.book?.condition ? `• ${it.book.condition}` : ''}
                            </div>
                          </td>
                          <td style={{ padding: 10 }}>{qty}</td>
                          <td style={{ padding: 10, textAlign: 'right' }}>{money.format(price)}</td>
                          <td style={{ padding: 10, textAlign: 'right' }}>{money.format(price * qty)}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: 10 }}>No items in this order.</td>
                      </tr>
                    )}
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
