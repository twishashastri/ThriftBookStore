const router = require('express').Router();
const Order = require('../models/Order');
const Book = require('../models/Book');
const { protect, restrictTo } = require('../middleware/auth');

// Buyer: place order (body: items: [{bookId}])
router.post('/', protect, restrictTo('buyer', 'admin'), async (req, res) => {
  try {
    const items = await Promise.all(
      (req.body.items || []).map(async ({ bookId }) => {
        const book = await Book.findById(bookId).populate('seller');
        if (!book || !book.isActive) throw new Error('Book unavailable');
        return { book: book._id, price: book.price, seller: book.seller._id };
      })
    );
    const order = await Order.create({ buyer: req.user._id, items });
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Buyer: my orders
router.get('/me', protect, restrictTo('buyer', 'admin'), async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort('-createdAt')
    .populate('items.book', 'title author price')
    .populate('items.seller', 'name');
  res.json(orders);
});

// Seller: orders of my books
router.get('/seller', protect, restrictTo('seller', 'admin'), async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id })
    .sort('-createdAt')
    .populate('items.book', 'title author price')
    .populate('buyer', 'name');
  res.json(orders);
});

// Admin: all orders
router.get('/', protect, restrictTo('admin'), async (_req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.json(orders);
});

module.exports = router;