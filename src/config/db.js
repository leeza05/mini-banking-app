import mongoose from 'mongoose';

const mongoURI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/mini-banking-app';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
