const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false }, // hide password by default
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  },
  { timestamps: true }
);

// Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Static method: count all users (for admin dashboard)
userSchema.statics.countAllUsers = function () {
  return this.countDocuments();
};

// Static method: get all users with selected fields
userSchema.statics.getAllUsers = function () {
  return this.find({}, 'name email role createdAt').sort({ createdAt: -1 });
};

module.exports = model('User', userSchema);
