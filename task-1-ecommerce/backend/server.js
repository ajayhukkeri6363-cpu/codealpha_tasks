const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Product = require('./models/Product');
const seedData = require('./utils/seeder');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ShopSphere API',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Seed API endpoint for instant re-seeding
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedData();
    res.json({
      success: true,
      message: 'Database reseeded successfully with full sample data',
    });
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route
app.get('/', (req, res) => {
  res.send('ShopSphere REST API is running smoothly.');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Auto-seed if database is empty
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[ShopSphere Server] Database is empty. Auto-seeding sample catalog and users...');
      await seedData();
    }
  } catch (err) {
    console.warn('[ShopSphere Server] Auto-seed check notice:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`[ShopSphere] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Error]: ${err.message}`);
});

module.exports = app;

