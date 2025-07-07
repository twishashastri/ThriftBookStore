const express = require('express');
const Book = require('../models/Book');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

// Get all books (public)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('seller', 'username email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load books' });
  }
});

// Create a book listing (protected; seller only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Access denied' });

    const { title, author, price, description, condition, imageUrl } = req.body;

    const book = new Book({
      title,
      author,
      price,
      description,
      condition,
      imageUrl,
      seller: req.user.id,
    });

    await book.save();

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book' });
  }
});

// Update book listing (protected; seller only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    Object.assign(book, req.body);

    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
});

// Delete book listing (protected; seller only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });

    await book.remove();

    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

module.exports = router;

