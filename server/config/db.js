import mongoose from 'mongoose';
import env from './env.js';

/**
 * Establish connection to MongoDB Atlas or local MongoDB instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If database connection fails on startup in production, terminate process
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Event listeners for database connection state changes
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost or disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully.');
});

export default connectDB;
