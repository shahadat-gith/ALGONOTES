import mongoose from 'mongoose';

export const connectDB = async () => {

  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('=> MongoDB Connected Cleanly');
  } catch (error) {
    console.error('=> MongoDB Connection Error:', error);
    throw error;
  }
};