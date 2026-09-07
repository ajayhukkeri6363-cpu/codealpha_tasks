const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

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

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'FlowBoard API', time: new Date() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`[FlowBoard Server] Running on http://localhost:${PORT}`);
});