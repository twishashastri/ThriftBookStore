const { Schema, model, Types } = require('mongoose');

const bookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ['new', 'like new', 'good', 'fair'], default: 'good' },
    genre: { type: String, default: 'General' },
    imageUrl: { type: String, default: '' },
    seller: { type: Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model('Book', bookSchema);