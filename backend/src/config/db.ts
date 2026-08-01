import mongoose from 'mongoose';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/artcorner';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
};

export default connectDB;
