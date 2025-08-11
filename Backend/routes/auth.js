const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

/** REGISTER */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const safeRole = ['buyer', 'seller', 'admin'].includes(role) ? role : 'buyer';

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: 'email already in use' });

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: safeRole
    });

    return res.status(201).json({
      message: 'Registration successful! Please log in to continue.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    if (e && e.code === 11000) {
      const field = Object.keys(e.keyPattern || {})[0] || 'field';
      return res.status(400).json({ message: `${field} already in use` });
    }
    return res.status(500).json({ message: e.message });
  }
});

/** LOGIN (returns token) */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    // ⬇️ fetch hidden password for bcrypt comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid email or password' });

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

/** CURRENT USER */
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

/** USERS COUNT (admin only) */
router.get('/count', protect, restrictTo('admin'), async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
