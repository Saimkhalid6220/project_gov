import mongoose, { Schema } from 'mongoose';
import { connectToDatabase } from '../lib/mongodb';

const pdfSchema = new Schema(
  {
    name: String,
    pdfId: String,
    data: Buffer,
    contentType: String,
  },
  {
    timestamps: true,
  }
);

let Pdf;

try {
  await connectToDatabase();
  Pdf = mongoose.models.Pdf || mongoose.model('Pdf', pdfSchema);
} catch (error) {
  console.error('Error initializing Pdf model:', error);
}

export default Pdf;