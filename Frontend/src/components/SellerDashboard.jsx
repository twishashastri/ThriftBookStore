import React, { useEffect, useState } from 'react';
import api from './api';

export default function SellerDashboard() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', price: 0, condition: 'good' });

  const load = async () => {
    const { data } = await api.get('/books/me/listings');
    setListings(data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.post('/books', form);
    setForm({ title: '', author: '', price: 0, condition: 'good' });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/books/${id}`);
    load();
  };

  return (
    <div>
      <h2>Seller Dashboard</h2>
      <div className="card">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
        <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
          <option>new</option>
          <option>like new</option>
          <option>good</option>
          <option>fair</option>
        </select>
        <button onClick={save}>Add Listing</button>
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