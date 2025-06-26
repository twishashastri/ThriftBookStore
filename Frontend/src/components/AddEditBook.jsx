import React, { useState } from 'react';
import axios from 'axios';

// AddEditBook component for sellers to add or edit book listings
const AddEditBook = () => {
  const [title, setTitle] = useState(''); // State for book title
  const [author, setAuthor] = useState(''); // State for book author
  const [price, setPrice] = useState(''); // State for book price
  const [description, setDescription] = useState(''); // State for book description
  const [condition, setCondition] = useState('Used'); // State for book condition
  const [imageUrl, setImageUrl] = useState(''); // State for book image URL

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      await axios.post('/api/books', { title, author, price, description, condition, imageUrl }, {
        headers: { Authorization: `Bearer ${token}` } // Include token in request headers
      });
      alert('Book added successfully!'); // Notify user of success
      window.location.href = '/seller-dashboard'; // Redirect to seller dashboard
    } catch (error) {
      alert('Failed to add book!'); // Notify user of failure
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add/Edit Book</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="Used">Used</option>
        <option value="New">New</option>
      </select>
      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddEditBook;
