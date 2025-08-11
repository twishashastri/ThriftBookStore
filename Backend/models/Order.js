const { Schema, model, Types } = require('mongoose');

const orderSchema = new Schema(
  {
    buyer: { type: Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        book: { type: Types.ObjectId, ref: 'Book', required: true },
        price: { type: Number, required: true },
        seller: { type: Types.ObjectId, ref: 'User', required: true },
      },
    ],
    status: { type: String, enum: ['placed', 'shipped', 'completed', 'cancelled'], default: 'placed' },
  },
  { timestamps: true }
);

module.exports = model('Order', orderSchema);