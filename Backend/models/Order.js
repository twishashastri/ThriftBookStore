const mongoose = require('mongoose');

// Schema for order tracking purchases
const orderSchema = new mongoose.Schema({
  buyer: {             // User who placed the order
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  books: [             // Array of books and quantities
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      quantity: { type: Number, default: 1 },
    }
  ],
  totalAmount: { type: Number, required: true }, // Total price for the order
  status: {                                       // Order status
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
