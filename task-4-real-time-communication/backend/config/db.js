const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const uri = rawUri ? rawUri.trim() : '';

  // In production (or whenever MONGODB_URI/MONGO_URI is provided), connect directly to Atlas
  if (isProduction || uri) {
    if (!uri) {
      console.error('================================================================');
      console.error('[Nexus DB Fatal Error] MONGODB_URI or MONGO_URI is required in production mode!');
      console.error('Please configure MONGODB_URI in your Render Web Service Environment.');
      console.error('Expected format: mongodb+srv://<user>:<password>@cluster0.mongodb.net/nexus_prod?retryWrites=true&w=majority');
      console.error('================================================================');
      process.exit(1);
    }

    try {
      console.log('[Nexus DB] Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri);
      console.log(`[Nexus DB] MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`[Nexus DB Fatal Error] Failed to connect to MongoDB Atlas: ${error.message}`);
      if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
        console.error('Diagnostic Check:');
        console.error('1. Verify your MongoDB Atlas Database User credentials under Atlas > Database Access.');
        console.error('2. Ensure no literal angle brackets (< or >) remain in MONGODB_URI.');
        console.error('3. If your password contains special characters (@, #, %, &, +, :, etc.), ensure they are URL-encoded.');
        console.error('4. Verify Network Access in MongoDB Atlas allows IP 0.0.0.0/0.');
      }
      process.exit(1);
    }
  }

  // Development / Local Testing Fallback Only (NODE_ENV !== 'production' and no MONGODB_URI)
  const localUri = 'mongodb://127.0.0.1:27017/nexus_db';
  try {
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Nexus DB] Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (localErr) {
    console.warn(`[Nexus DB] Local MongoDB unavailable (${localErr.message}). Starting Embedded MongoMemoryServer for local development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Nexus DB] Embedded MongoMemoryServer Connected: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`[Nexus DB] Failed to start embedded DB: ${memErr.message}`);
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