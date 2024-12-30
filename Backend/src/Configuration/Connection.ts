import mongoose from 'mongoose';

const Connection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/coally', {
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if connection fails
  }
};

export default Connection;
