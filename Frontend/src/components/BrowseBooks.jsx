import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get('/books', { params: q ? { q } : {} });
    setBooks(data);
  };

  useEffect(() => { load(); }, []);

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ bookId: book._id });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
  };

  return (
    <div>
      <h2>Browse Books</h2>
      <input placeholder="Search title/author" value={q} onChange={(e) => setQ(e.target.value)} />
      <button onClick={load}>Search</button>
      <ul>
        {books.map((b) => (
          <li key={b._id} className="card">
            <strong>{b.title}</strong> by {b.author} — ${b.price} ({b.condition})
            <div>
              {user?.role === 'buyer' && <button onClick={() => addToCart(b)}>Add to Cart</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
