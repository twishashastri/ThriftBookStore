const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

// Place a new order (protected; buyer)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ message: 'Access denied' });

    const { books, totalAmount } = req.body;

    const order = new Order({
      buyer: req.user.id,
      books,
      totalAmount,
      status: 'Pending',
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// Get orders for a user (buyer/seller/admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'buyer') {
      orders = await Order.find({ buyer: req.user.id }).populate('books.book');
    } else if (req.user.role === 'seller') {
      // Seller sees orders of own books
      // This requires querying orders containing books sold by seller - more complex logic
      orders = await Order.find({}).populate('books.book buyer');
      orders = orders.filter(order => 
        order.books.some(b => b.book.seller.toString() === req.user.id)
      );
    } else if (req.user.role === 'admin') {
      orders = await Order.find({}).populate('books.book buyer');
    }

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

module.exports = router;
