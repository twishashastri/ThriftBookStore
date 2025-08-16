import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    const params = {};
    if (q) params.q = q;
    if (genre) params.genre = genre;
    if (condition) params.condition = condition;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy) params.sortBy = sortBy;

    try {
      const { data } = await api.get('/books', { params });
      setBooks(data || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
    }
  };

  useEffect(() => { load(); }, []);

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
    if (window.confirm('Added to cart. Go to cart now?')) {
      navigate('/cart');
    }
  };

  return (
    <div className="container">
      <h2>Browse Books</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search title/author"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="fiction">Fiction</option>
          <option value="nonfiction">Non-fiction</option>
          <option value="fantasy">Fantasy</option>
          <option value="sci-fi">Sci-Fi</option>
          <option value="romance">Romance</option>
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="like new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button onClick={load}>Apply</button>
      </div>

      <ul>
        {books.length === 0 ? (
          <li className="empty">No books found matching your filters.</li>
        ) : (
          books.map((b) => (
            <li key={b._id} className="card">
              <strong>{b.title}</strong>
              <span className="muted">
                by {b.author} — ${b.price} ({b.condition})
              </span>
              {user?.role === 'buyer' && (
                <div>
                  <button onClick={() => addToCart(b)}>Add to Cart</button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
