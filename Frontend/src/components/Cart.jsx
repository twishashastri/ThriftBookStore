import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const TAX_RATE = 0.13; // adjust if you need

export default function Cart() {
  const navigate = useNavigate();
  const money = useMemo(
    () => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }),
    []
  );

  const [items, setItems] = useState([]);

  const read = () => JSON.parse(localStorage.getItem('cart') || '[]');
  const write = (next) => localStorage.setItem('cart', JSON.stringify(next));

  useEffect(() => { setItems(read()); }, []);

  const updateQty = (bookId, delta) => {
    const next = read().map(it =>
      it.bookId === bookId ? { ...it, qty: Math.max(1, Number(it.qty || 1) + delta) } : it
    );
    write(next); setItems(next);
  };
  const removeOne = (bookId) => {
    const next = read().filter(it => it.bookId !== bookId);
    write(next); setItems(next);
  };

  const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = subtotal + tax;

  const placeOrder = async () => {
    if (!items.length) return;
    try {
      const payload = { items: items.map(i => ({ bookId: i.bookId, qty: i.qty })) };
      await api.post('/orders', payload);

      // clear cart
      localStorage.removeItem('cart');
      setItems([]);

      // flash message and go to Orders
      sessionStorage.setItem('justOrdered', '1');
      navigate('/buyer');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="container page--cart">
      <h2>Cart</h2>

      {/* NEW: small toolbar for quick actions */}
      <div style={{ display: 'flex', gap: 8, margin: '6px 0 12px' }}>
        <button className="btn" onClick={() => navigate('/browse')}>Continue Browsing</button>
        <button className="btn btn--ghost" onClick={() => navigate('/buyer')}>View Orders</button>
      </div>

      {/* List */}
      {!items.length ? (
        <div className="card empty">
          No items.{' '}
          {/* NEW: quick jump to orders even when cart is empty */}
          <button className="btn btn--link" onClick={() => navigate('/buyer')}>Go to Orders →</button>
        </div>
      ) : (
        <>
          <div className="cart__list">
            {items.map((it) => (
              <div key={it.bookId} className="cart__row">
                <div className="cart__main">
                  <div className="cart__title">{it.title || 'Book'}</div>
                  <div className="cart__meta">
                    <span>by {it.author}</span>
                    {it.condition && <span>· {it.condition}</span>}
                  </div>
                </div>

                <div className="cart__price" data-label="Unit">
                  {money.format(Number(it.price || 0))}
                </div>

                <div className="cart__qty" data-label="Qty">
                  <button onClick={() => updateQty(it.bookId, -1)} aria-label="Decrease">−</button>
                  <span>{it.qty || 1}</span>
                  <button onClick={() => updateQty(it.bookId, 1)} aria-label="Increase">+</button>
                </div>

                <div className="cart__sub" data-label="Subtotal">
                  {money.format(Number(it.price || 0) * Number(it.qty || 1))}
                </div>

                <button className="cart__remove" onClick={() => removeOne(it.bookId)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart__summary">
            <div />
            <div>
              <span>Subtotal</span><br />
              <strong>{money.format(subtotal)}</strong>
            </div>
            <div>
              <span>Tax</span><br />
              <strong>{money.format(tax)}</strong>
            </div>
            <div>
              <span>Total</span><br />
              <strong>{money.format(total)}</strong>
            </div>
            <button className="btn btn--primary" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
