const mongoose = require('mongoose');

// Schema to store book information
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },         // Book title
  author: { type: String, required: true },        // Author name
  description: { type: String, default: '' },      // Optional description
  price: { type: Number, required: true },         // Price in dollars
  condition: { type: String, enum: ['New', 'Used'], default: 'Used' }, // Condition
  seller: {                                        // Link book to a seller user id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: { type: String, default: '' },         // URL to book image
}, { timestamps: true });                           // Auto timestamps

module.exports = mongoose.model('Book', bookSchema);
