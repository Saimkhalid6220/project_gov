import mongoose, { Schema } from 'mongoose';
import { connectToDatabase } from '../lib/mongodb';

const courtCasesSchema = new Schema(
  {
    date_of_hearing: String,
    cp_sa_suit: String,
    subject: String,
    petitioner: String,
    court: String,
    concerned_office: String,
    comments: String,
    last_hearing_date: String,
    remarks: String,
  },
  {
    timestamps: true,
  }
);

let CourtCases;

try {
  await connectToDatabase();
  CourtCases = mongoose.models.CourtCases || mongoose.model('CourtCases', courtCasesSchema);
} catch (error) {
  console.error('Error initializing CourtCases model:', error);
}

export default CourtCases;