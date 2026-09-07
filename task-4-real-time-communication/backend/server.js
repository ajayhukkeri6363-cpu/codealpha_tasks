const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const ChatMessage = require('./models/ChatMessage');
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

// In-Memory Room Participant Tracking: roomId -> Map(socketId -> { socketId, user })
const rooms = new Map();
const whiteboardHistory = new Map(); // roomId -> Array of stroke commands

io.on('connection', (socket) => {
  console.log(`[Nexus Sockets] Client connected: ${socket.id}`);

  // 1. WebRTC Room Join & Signaling
  socket.on('join_room', ({ roomId, user }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    const roomUsers = rooms.get(roomId);
    roomUsers.set(socket.id, { socketId: socket.id, user });

    // Inform the new user about all existing peers
    const existingPeers = Array.from(roomUsers.values()).filter((p) => p.socketId !== socket.id);
    socket.emit('all_peers', existingPeers);

    // Send existing whiteboard drawings to the new peer
    if (whiteboardHistory.has(roomId)) {
      socket.emit('whiteboard_history', whiteboardHistory.get(roomId));
    }

    // Broadcast to others that a new peer joined
    socket.to(roomId).emit('peer_joined', {
      socketId: socket.id,
      user,
    });

    console.log(`[Nexus Sockets] User ${user?.name || socket.id} joined room ${roomId} (Total: ${roomUsers.size})`);
  });

  // WebRTC Signal Forwarding (Offer, Answer, ICE Candidate)
  socket.on('webrtc_signal', ({ to, signal, from, user }) => {
    io.to(to).emit('webrtc_signal_remote', {
      from: socket.id,
      signal,
      user,
    });
  });

  // Media Track Toggles (Mute / Camera off / Screen Share)
  socket.on('media_toggle', ({ roomId, type, enabled }) => {
    socket.to(roomId).emit('peer_media_toggled', {
      socketId: socket.id,
      type,
      enabled,
    });
  });

  // 2. Real-Time Synchronized Whiteboard
  socket.on('draw_stroke', ({ roomId, stroke }) => {
    if (!whiteboardHistory.has(roomId)) {
      whiteboardHistory.set(roomId, []);
    }
    const history = whiteboardHistory.get(roomId);
    history.push(stroke);
    if (history.length > 5000) history.shift(); // Keep buffer bounded

    socket.to(roomId).emit('draw_stroke_remote', stroke);
  });

  socket.on('clear_whiteboard', ({ roomId }) => {
    whiteboardHistory.set(roomId, []);
    socket.to(roomId).emit('clear_whiteboard_remote');
  });

  // 3. Real-Time In-Meeting Chat
  socket.on('send_chat', async ({ roomId, sender, senderName, senderAvatar, text, fileUrl, fileName, fileType }) => {
    try {
      const message = await ChatMessage.create({
        roomId,
        sender,
        senderName,
        senderAvatar,
        text,
        fileUrl,
        fileName,
        fileType,
      });

      io.to(roomId).emit('receive_chat', message);
    } catch (err) {
      console.error('Error saving chat message:', err.message);
    }
  });

  // Disconnect & Room Cleanup
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms.has(roomId)) {
        const roomUsers = rooms.get(roomId);
        const exitingUser = roomUsers.get(socket.id);
        roomUsers.delete(socket.id);

        socket.to(roomId).emit('peer_left', {
          socketId: socket.id,
          user: exitingUser?.user,
        });

        if (roomUsers.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Nexus Sockets] Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Nexus Communication API', time: new Date() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5003;

connectDB().then(async () => {
  try {
    const Meeting = require('./models/Meeting');
    const seedData = require('./utils/seeder');
    const count = await Meeting.countDocuments();
    if (count === 0) {
      console.log('[Nexus Server] Database empty. Auto-seeding initial rooms and users...');
      await seedData();
    }
  } catch (err) {
    console.warn('[Nexus Server] Auto-seed notice:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`[Nexus Server] Running on http://localhost:${PORT}`);
  });
});

module.exports = { app, server };