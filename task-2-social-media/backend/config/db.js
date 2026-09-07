const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pulse_social';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Pulse DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Pulse DB] Local MongoDB unavailable (${error.message}). Starting Embedded MongoMemoryServer...`);

    try {
      let MongoMemoryServer;
      try {
        MongoMemoryServer = require('../../task-3-project-management/backend/node_modules/mongodb-memory-server').MongoMemoryServer;
      } catch (e) {
        MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
      }
      
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Pulse DB] Embedded MongoMemoryServer Connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`[Pulse DB] Failed to start embedded DB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = { connectDB };
