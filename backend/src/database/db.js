import mongoose from 'mongoose';

// Cache variable for the database connection
let isConnected = null;

export const connectDB = async () => {
  // If a connection already exists, re-use it across warm Lambda invocations
  if (isConnected) {
    console.log('=> Re-using existing MongoDB connection cache');
    return isConnected;
  }


  try {
    // Configure Mongoose connection behaviors optimized for Serverless architectures
    const db = await mongoose.connect(process.env.DATABASE_URL);

    // Update connection state cache
    isConnected = db.connections[0].readyState;
    console.log('=> MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('=> MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;