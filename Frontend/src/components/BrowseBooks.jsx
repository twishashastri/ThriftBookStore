import React, { useEffect, useState } from 'react';
import axios from 'axios';

// BrowseBooks component to display available books
const BrowseBooks = () => {
  const [books, setBooks] = useState([]); // State to hold books data

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get('/api/books'); // Fetch books from backend
      setBooks(response.data); // Update state with fetched books
    };
    fetchBooks(); // Call fetch function
  }, []);

  return (
    <div>
      <h2>Available Books</h2>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <img src={book.imageUrl} alt={book.title} /> // Display book image
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowseBooks;
