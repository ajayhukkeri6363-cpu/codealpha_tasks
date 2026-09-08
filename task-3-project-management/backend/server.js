const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Socket.io Real-Time Kanban Engine
io.on('connection', (socket) => {
  console.log(`[FlowBoard Sockets] Client connected: ${socket.id}`);

  socket.on('join_project', (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`[FlowBoard Sockets] Socket ${socket.id} joined room: project_${projectId}`);
  });

  socket.on('leave_project', (projectId) => {
    socket.leave(`project_${projectId}`);
    console.log(`[FlowBoard Sockets] Socket ${socket.id} left room: project_${projectId}`);
  });

  socket.on('task_dragged', (data) => {
    // Broadcast to other peers in project room
    socket.to(`project_${data.projectId}`).emit('task_dragged_remote', data);
  });

  socket.on('disconnect', () => {
    console.log(`[FlowBoard Sockets] Client disconnected: ${socket.id}`);
  });
});

// CORS Configuration - Permissive for Vercel production & preview deployments
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5175',
  'http://localhost:5173',
  'http://localhost:5002',
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

// Import route modules
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Dual mounting (/api/... and /...) for production URL resilience
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/analytics', analyticsRoutes);

app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'healthy', service: 'FlowBoard API', time: new Date() });
});

// Reseed endpoint for cloud deployment evaluation
app.post(['/api/seed', '/seed'], async (req, res, next) => {
  try {
    const seedData = require('./utils/seeder');
    await seedData();
    res.json({ success: true, message: 'FlowBoard database reseeded successfully' });
  } catch (err) {
    next(err);
  }
});

app.get('/', (req, res) => {
  res.send('FlowBoard Project Management REST API is running.');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const Project = require('./models/Project');
    const seedData = require('./utils/seeder');

    // Clean any orphaned index from legacy shared database collections
    try {
      await User.collection.dropIndex('username_1');
    } catch (idxErr) {}

    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('[FlowBoard Server] Database empty. Auto-seeding initial projects and tasks...');
      await seedData();
    }
  } catch (err) {
    console.warn('[FlowBoard Server] Auto-seed notice:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`[FlowBoard Server] Running on port ${PORT}`);
  });
});

module.exports = { app, server };