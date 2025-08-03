const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/books — Public: Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('seller', 'username email');
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to load books' });
  }
});

// POST /api/books — Protected: Create a book (seller only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Only sellers can list books.' });
    }

    const { title, author, price, description, condition, imageUrl } = req.body;

    const newBook = new Book({
      title,
      author,
      price,
      description,
      condition,
      imageUrl,
      seller: req.user.id,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
});

// PUT /api/books/:id — Protected: Update a book (seller only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your book.' });
    }

    Object.assign(book, req.body);
    await book.save();

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

// DELETE /api/books/:id — Protected: Delete a book (seller only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your book.' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

module.exports = router;
