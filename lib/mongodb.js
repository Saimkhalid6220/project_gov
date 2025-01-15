import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let isConnected;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  try {
    await mongoose.connect(uri, options);
    isConnected = mongoose.connections[0].readyState;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Could not connect to MongoDB');
  }
}