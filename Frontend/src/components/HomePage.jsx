import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__content">
          <h1>Discover, Buy, & Sell Pre-Loved Books</h1>
          <p className="hero__subtitle">
            Stretch your budget and your imagination. ThriftBookStore connects buyers and sellers
            with quality second-hand books at student-friendly prices.
          </p>
          <div className="hero__cta">
            <Link to="/browse" className="btn btn--primary">Start Browsing</Link>
            <Link to="/register" className="btn btn--ghost">Become a Seller</Link>
          </div>
          <p className="hero__meta">
            <span>Over 5,000 titles listed</span>
            <span>•</span>
            <span>Secure orders</span>
            <span>•</span>
            <span>Fast messaging</span>
          </p>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__card hero__card--1" />
          <div className="hero__card hero__card--2" />
          <div className="hero__card hero__card--3" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <div className="feature__icon"></div>
          <h3>Save Big</h3>
          <p>Buy great books at a fraction of the original price. Filters help you find exactly what you need.</p>
        </div>
        <div className="feature">
          <div className="feature__icon"></div>
          <h3>Easy Selling</h3>
          <p>List a book in seconds from your seller dashboard. Track orders and manage inventory effortlessly.</p>
        </div>
        <div className="feature">
          <div className="feature__icon"></div>
          <h3>Safe & Secure</h3>
          <p>Role-based access and protected routes keep your account and orders safe.</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="categories__grid">
          {[
            'Fiction', 'Non-Fiction', 'Fantasy', 'Sci-Fi', 'Romance', 'NoteBooks'
          ].map((c) => (
            <Link key={c} to={`/browse?q=${encodeURIComponent(c)}`} className="chip">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="highlights">
        <div className="highlight__card">
          <img
            src="https://fastly.picsum.photos/id/832/5000/3333.jpg?hmac=hFHyNp_cIcOMyxpCcTWRd_UM1QEHUyxu4PYl1l7c_fk"
            alt="Assorted used books stacked"
            loading="lazy"
          />
          <div>
            <h3>Verified Sellers</h3>
            <p>We help students and local sellers reach real readers. Good books deserve a second life.</p>
            <Link to="/register" className="btn btn--link">Open a seller account →</Link>
          </div>
        </div>

        <div className="highlight__card">
          <img
            src="https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I"
            alt="Student reading with coffee"
            loading="lazy"
          />
          <div>
            <h3>Student-Friendly Pricing</h3>
            <p>Use filters for condition and price range to find quality books that fit your budget.</p>
            <Link to="/browse" className="btn btn--link">Explore deals →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="quote">
          <p>“I resold my semester books in one evening. Super simple.”</p>
          <span>— Priya, Seller</span>
        </div>
        <div className="quote">
          <p>“Found three novels for under $15. Will be back!”</p>
          <span>— Daniel, Buyer</span>
        </div>
        <div className="quote">
          <p>“The seller dashboard and order tracking are so smooth.”</p>
          <span>— Ahmed, Seller</span>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <div className="cta__actions">
          <Link to="/login" className="btn btn--primary">Login</Link>
          <Link to="/register" className="btn btn--ghost">Create Account</Link>
        </div>
      </section>
    </div>
  );
}
