import mongoose from 'mongoose';

const Connection = async () => {
  try {
    //PROD :: mongodb+srv://jeyssonpaypal:lPreQkkFZlT4dx0H@cluster0.mongodb.net/Coally?retryWrites=true&w=majority
    //LOCAL :: mongodb://localhost:27017/coally
    await mongoose.connect('mongodb+srv://jeyssonpaypal:lPreQkkFZlT4dx0H@cluster0.s23cc.mongodb.net/Coally?retryWrites=true&w=majority', {
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if connection fails
  }
};

export default Connection;
