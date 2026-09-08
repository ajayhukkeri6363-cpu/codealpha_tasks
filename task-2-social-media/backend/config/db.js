const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI;

  // In production (or whenever MONGODB_URI is provided), connect directly to Atlas/external MongoDB
  if (isProduction || uri) {
    if (!uri) {
      console.error('================================================================');
      console.error('[Pulse DB Fatal Error] MONGODB_URI is required in production mode!');
      console.error('Please configure MONGODB_URI in your Render Web Service Environment.');
      console.error('Expected format: mongodb+srv://<user>:<password>@cluster0.mongodb.net/pulse_prod?retryWrites=true&w=majority');
      console.error('================================================================');
      process.exit(1);
    }

    try {
      console.log('[Pulse DB] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        dbName: 'pulse_prod',
      });
      console.log(`[Pulse DB] MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[Pulse DB Fatal Error] Failed to connect to MongoDB Atlas: ${error.message}`);
      process.exit(1);
    }
  }

  // Development / Local Testing Fallback Only (NODE_ENV !== 'production' and no MONGODB_URI)
  const localUri = 'mongodb://127.0.0.1:27017/pulse_social';
  try {
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Pulse DB] Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn(`[Pulse DB] Local MongoDB unavailable (${localErr.message}). Starting Embedded MongoMemoryServer for local development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Pulse DB] Embedded MongoMemoryServer Connected: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`[Pulse DB] Failed to start embedded DB: ${memErr.message}`);
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
