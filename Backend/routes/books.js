const router = require('express').Router();
const Book = require('../models/Book');
const { protect, restrictTo } = require('../middleware/auth');

// Public: list & search
router.get('/', async (req, res) => {
  const { q, genre, min, max, sort = '-createdAt' } = req.query;
  const filter = { isActive: true };
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }];
  if (genre) filter.genre = genre;
  if (min || max) filter.price = { ...(min && { $gte: +min }), ...(max && { $lte: +max }) };
  const books = await Book.find(filter).sort(sort).populate('seller', 'name');
  res.json(books);
});

// Seller: create
router.post('/', protect, restrictTo('seller', 'admin'), async (req, res) => {
  try {
    const payload = { ...req.body, seller: req.user._id };
    const book = await Book.create(payload);
    res.status(201).json(book);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Seller: update own book
router.put('/:id', protect, restrictTo('seller', 'admin'), async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && String(book.seller) !== String(req.user._id))
    return res.status(403).json({ message: 'Not allowed' });
  Object.assign(book, req.body);
  await book.save();
  res.json(book);
});

// Seller/Admin: delete
router.delete('/:id', protect, restrictTo('seller', 'admin'), async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && String(book.seller) !== String(req.user._id))
    return res.status(403).json({ message: 'Not allowed' });
  await book.deleteOne();
  res.json({ message: 'Deleted' });
});

// Seller: my listings
router.get('/me/listings', protect, restrictTo('seller', 'admin'), async (req, res) => {
  const books = await Book.find({ seller: req.user._id });
  res.json(books);
});

module.exports = router;