const router = require('express').Router();
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// GET total user count (Admin only)
router.get('/count', protect, restrictTo('admin'), async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
