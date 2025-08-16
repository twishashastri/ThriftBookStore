import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const TAX_RATE = 0.13;

export default function Checkout() {
  const navigate = useNavigate();
  const money = useMemo(
    () => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }),
    []
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', postalCode: '', country: ''
  });

  useEffect(() => setItems(JSON.parse(localStorage.getItem('cart') || '[]')), []);

  const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = subtotal + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    // validation
    for (let key in form) {
      if (!form[key]) { alert(`Please enter ${key}`); return; }
    }
    if (!items.length) { alert('Cart is empty'); return; }

    try {
      const payload = {
        items: items.map(i => ({ bookId: i.bookId, qty: i.qty })),
        shipping: form,
      };
      await api.post('/orders', payload);

      localStorage.removeItem('cart');
      setItems([]);
      sessionStorage.setItem('justOrdered', '1');
      navigate('/buyer');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="container page--checkout">
      <h2>Checkout</h2>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* Shipping Form */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3>Shipping Details</h3>
          {['name','email','address','city','postalCode','country'].map((field) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <label>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                style={{ width: '100%', padding: 6 }}
              />
            </div>
          ))}
          <button className="btn btn--primary" onClick={placeOrder}>Place Order</button>
        </div>

        {/* Cart Summary */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3>Order Summary</h3>
          {items.map(it => (
            <div key={it.bookId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span>{it.title} x {it.qty}</span>
              <span>{money.format(it.price * it.qty)}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Subtotal:</strong> <span>{money.format(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Tax:</strong> <span>{money.format(tax)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Total:</strong> <span>{money.format(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
