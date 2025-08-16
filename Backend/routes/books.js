const router = require('express').Router();
const Book = require('../models/Book');
const { protect, restrictTo } = require('../middleware/auth');

// Public: list & search
router.get('/', async (req, res) => {
  try {
    const { q, genre, condition, minPrice, maxPrice, sortBy } = req.query;
    const filter = { isActive: true };

    // Search by title/author
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ];
    }

    // Genre filter
    if (genre) filter.genre = genre;

    // Condition filter
    if (condition) filter.condition = condition;

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sort = { createdAt: -1 }; // default newest
    if (sortBy === 'priceAsc') sort = { price: 1 };
    if (sortBy === 'priceDesc') sort = { price: -1 };
    if (sortBy === 'newest') sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const books = await Book.find(filter).sort(sort).populate('seller', 'name');
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
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