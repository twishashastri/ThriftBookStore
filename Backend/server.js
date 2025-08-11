const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users'); // ✅ Added users route

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.get('/', (_, res) => res.send('ThriftBookStore API running'));
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', usersRoutes); // ✅ Admin will access users here

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'thriftbookstore' })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));
