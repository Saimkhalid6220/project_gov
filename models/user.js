import mongoose, { Schema } from 'mongoose';
import { connectToDatabase } from '../lib/mongodb';

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

let User;

try {
  await connectToDatabase();
  User = mongoose.models.User || mongoose.model('User', userSchema);
} catch (error) {
  console.error('Error initializing User model:', error);
}

export default User;