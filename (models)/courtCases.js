import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const courtCasesSchema = new Schema(
  {
    sr_no: Number,
    date_of_hearing: String,
    cp_sa_suit: String,
    subject:String,
    petitioner:String,
    court:String,
    concerned_office:String,
    comments:String,
    last_hearing_date:String,
    remarks:String
  },
  {
    timestamps: true,
  }
);

const CourtCases = mongoose.models.CourtCases || mongoose.model("CourtCases", courtCasesSchema);

export default CourtCases;