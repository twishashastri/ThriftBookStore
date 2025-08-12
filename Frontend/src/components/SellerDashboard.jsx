import React, { useEffect, useState } from 'react';
import api from './api';

export default function SellerDashboard() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', price: 0, condition: 'good' });
  const [err, setErr] = useState('');

  const load = async () => {
    const { data } = await api.get('/books/me/listings');
    setListings(data);
  };
  useEffect(() => { load(); }, []);

  // 🔹 NEW: show an error as soon as a field loses focus and is invalid
  const validateOnBlur = (field) => {
    const title = String(form.title || '').trim();
    const author = String(form.author || '').trim();
    const priceNum = Number(form.price);

    if (field === 'title' && !title) return setErr('Please enter the book title.');
    if (field === 'author' && !author) return setErr('Please enter the author.');
    if (field === 'price' && (!Number.isFinite(priceNum) || priceNum <= 0))
      return setErr('Please enter a valid price greater than 0.');
  };

  const save = async () => {
    // Basic front-end validation (still runs if button enabled)
    const title = String(form.title || '').trim();
    const author = String(form.author || '').trim();
    const priceNum = Number(form.price);

    if (!title) return setErr('Please enter the book title.');
    if (!author) return setErr('Please enter the author.');
    if (!Number.isFinite(priceNum) || priceNum <= 0) return setErr('Please enter a valid price greater than 0.');

    try {
      setErr('');
      await api.post('/books', { ...form, title, author, price: priceNum });
      setForm({ title: '', author: '', price: 0, condition: 'good' });
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to add listing. Please try again.');
    }
  };

  const remove = async (id) => {
    await api.delete(`/books/${id}`);
    load();
  };

  // Disable button until the form is valid
  const canSave =
    String(form.title || '').trim().length > 0 &&
    String(form.author || '').trim().length > 0 &&
    Number(form.price) > 0;

  return (
    <div>
      <h2>Seller Dashboard</h2>

      <div className="card">
        {/* error bar */}
        {err && <div className="error" style={{ gridColumn: '1 / -1' }} role="alert" aria-live="polite">{err}</div>}

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => { setErr(''); setForm({ ...form, title: e.target.value }); }}
          onBlur={() => validateOnBlur('title')}
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => { setErr(''); setForm({ ...form, author: e.target.value }); }}
          onBlur={() => validateOnBlur('author')}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => { setErr(''); setForm({ ...form, price: +e.target.value }); }}
          onBlur={() => validateOnBlur('price')}
          min="0.01"
          step="0.01"
          inputMode="decimal"
        />
        <select
          value={form.condition}
          onChange={(e) => { setErr(''); setForm({ ...form, condition: e.target.value }); }}
        >
          <option>new</option>
          <option>like new</option>
          <option>good</option>
          <option>fair</option>
        </select>

        <button onClick={save} disabled={!canSave}>Add Listing</button>
      </div>

      <ul>
        {listings.map((b) => (
          <li key={b._id} className="card">
            {b.title} — ${b.price}
            <button onClick={() => remove(b._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
