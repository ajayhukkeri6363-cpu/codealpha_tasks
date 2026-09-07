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

// CORS Configuration - Permissive for Vercel production & preview deployments
const allowedOrigins = [
  'https://shopsphere-frontend-pi.vercel.app',
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check route
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    app: 'ShopSphere API',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Seed API endpoint for instant re-seeding
app.post(['/api/seed', '/seed'], async (req, res, next) => {
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

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount Routes - Dual mounting (/api/... and /...) for production URL resilience
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/cart', cartRoutes);
app.use('/cart', cartRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/reviews', reviewRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

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

