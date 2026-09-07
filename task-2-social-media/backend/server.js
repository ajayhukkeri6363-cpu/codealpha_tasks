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

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Pulse Social API', uptime: process.uptime() });
});

// Reseed endpoint
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedPulseData();
    res.json({ success: true, message: 'Pulse database reseeded successfully' });
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/saved', require('./routes/savedRoutes'));

app.get('/', (req, res) => {
  res.send('Pulse Social Media REST API is running.');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      console.log('[Pulse Server] Database is empty. Auto-seeding sample social data...');
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
