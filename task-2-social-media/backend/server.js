const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Post = require('./models/Post');
const seedPulseData = require('./utils/seeder');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io for real-time notifications
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  // Join user room for targeted notifications
  socket.on('join_user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  socket.on('disconnect', () => {});
});

// CORS Configuration - Permissive for Vercel production & preview deployments
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5001',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
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

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', app: 'Pulse Social API', uptime: process.uptime(), timestamp: new Date() });
});

// Reseed endpoint
app.post(['/api/seed', '/seed'], async (req, res, next) => {
  try {
    await seedPulseData();
    res.json({ success: true, message: 'Pulse database reseeded successfully' });
  } catch (err) {
    next(err);
  }
});

// Import route modules
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const savedRoutes = require('./routes/savedRoutes');

// Routes - Dual mounting (/api/... and /...) for production URL resilience
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/posts', postRoutes);
app.use('/posts', postRoutes);

app.use('/api/comments', commentRoutes);
app.use('/comments', commentRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

app.use('/api/saved', savedRoutes);
app.use('/saved', savedRoutes);

app.get('/', (req, res) => {
  res.send('Pulse Social Media REST API is running.');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    if (userCount === 0 || postCount === 0) {
      console.log('[Pulse Server] Database is empty or incomplete. Auto-seeding sample social data...');
      await seedPulseData();
    }
  } catch (err) {
    console.warn('[Pulse Server] Auto-seed notice:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`[PULSE] Server listening on port ${PORT}`);
  });
});

module.exports = { app, server };
