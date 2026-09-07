const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let mongoServer;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flowboard_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[FlowBoard DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[FlowBoard DB] Local MongoDB unavailable (${err.message}). Initializing In-Memory MongoServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      const memConn = await mongoose.connect(memUri);
      console.log(`[FlowBoard DB] In-Memory MongoDB running successfully at ${memUri}`);
    } catch (memErr) {
      console.error(`[FlowBoard DB] In-Memory Mongo fallback failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;