const mongoose = require('mongoose');

// Schema defining how user data is stored in MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username
  email: { type: String, required: true, unique: true },    // Unique email
  password: { type: String, required: true },               // Hashed password
  role: {                                                   // User role for access control
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
}, { timestamps: true }); // Automatically create 'createdAt' and 'updatedAt'

module.exports = mongoose.model('User', userSchema);
