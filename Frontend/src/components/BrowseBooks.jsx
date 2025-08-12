import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await api.get('/books', { params: q ? { q } : {} });
    setBooks(data || []);
  };
  useEffect(() => { load(); }, []);

  // Add to cart with quantity merge + minimal cached fields for UI
  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((c) => c.bookId === book._id);
    if (idx >= 0) {
      cart[idx].qty = Number(cart[idx].qty || 1) + 1;
    } else {
      cart.push({
        bookId: book._id,
        qty: 1,
        title: book.title,
        author: book.author,
        price: Number(book.price || 0),
        condition: book.condition
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Nice confirm → go to cart
    if (window.confirm('Added to cart. Go to cart now?')) {
      navigate('/cart');
    }
  };

  return (
    <div className="container">
      <h2>Browse Books</h2>

      <input
        placeholder="Search title/author"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button onClick={load}>Search</button>

      <ul>
        {books.map((b) => (
          <li key={b._id} className="card">
            <strong>{b.title}</strong>
            <span className="muted">
              by {b.author} — ${b.price} ({b.condition})
            </span>
            <div>
              {user?.role === 'buyer' && (
                <button onClick={() => addToCart(b)}>Add to Cart</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
