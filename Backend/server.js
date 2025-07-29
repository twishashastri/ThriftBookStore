require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow cross-origin requests so front and backends can communicate
app.use(cors());

// Allow our server to understand JSON sent by clients
app.use(express.json());

// Connect to MongoDB with URI from .env file
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);    // Authentication routes
app.use('/api/books', bookRoutes);   // Books CRUD routes
app.use('/api/orders', orderRoutes); // Orders routes

// Start server listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
