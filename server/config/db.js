import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from '../seed/seedData.js';
import User from '../models/User.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/course_registration_db';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${defaultUri}`);
    
    // Try connecting to primary MongoDB instance with a short timeout
    const conn = await mongoose.connect(defaultUri, {
      serverSelectionTimeoutMS: 2500,
    });

    console.log(`[Database] Connected to external MongoDB host: ${conn.connection.host}`);
    
    // Check if database needs initial seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Empty database detected. Seeding initial data...');
      await seedDatabase();
    }
    
    return conn;
  } catch (externalErr) {
    console.warn(`[Database] External MongoDB connection failed (${externalErr.message}).`);
    console.log('[Database] Initializing Embedded MongoDB Server (mongodb-memory-server)...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to Embedded In-Memory MongoDB instance successfully!`);
      
      // Auto seed embedded database
      console.log('[Database] Auto-seeding Embedded MongoDB instance...');
      await seedDatabase();

      return conn;
    } catch (memErr) {
      console.error('[Database] Critical Error: Failed to start embedded MongoDB:', memErr.message);
      throw memErr;
    }
  }
};
