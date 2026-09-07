const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopsphere';

  try {
    // Try connecting to the provided MongoDB URI with a short timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to external MongoDB at ${uri} (${error.message}).`);
    console.log(`[Database] Initializing embedded MongoDB Memory Server for seamless local execution...`);

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
      console.log(`[Database] Embedded MongoDB Memory Server Connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`[Database] Failed to initialize embedded MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
