const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  // In production (or whenever MONGODB_URI/MONGO_URI is provided), connect directly to Atlas
  if (isProduction || uri) {
    if (!uri) {
      console.error('================================================================');
      console.error('[FlowBoard DB Fatal Error] MONGODB_URI or MONGO_URI is required in production mode!');
      console.error('Please configure MONGODB_URI in your Render Web Service Environment.');
      console.error('Expected format: mongodb+srv://<user>:<password>@cluster0.mongodb.net/flowboard_prod?retryWrites=true&w=majority');
      console.error('================================================================');
      process.exit(1);
    }

    try {
      console.log('[FlowBoard DB] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri);
      console.log(`[FlowBoard DB] MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[FlowBoard DB Fatal Error] Failed to connect to MongoDB Atlas: ${error.message}`);
      process.exit(1);
    }
  }

  // Development / Local Testing Fallback Only (NODE_ENV !== 'production' and no MONGODB_URI)
  const localUri = 'mongodb://127.0.0.1:27017/flowboard_db';
  try {
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[FlowBoard DB] Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn(`[FlowBoard DB] Local MongoDB unavailable (${localErr.message}). Starting Embedded MongoMemoryServer for local development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[FlowBoard DB] Embedded MongoMemoryServer Connected: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`[FlowBoard DB] Failed to start embedded DB: ${memErr.message}`);
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

module.exports = connectDB;