import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const pdfSchema = new Schema(
  {
    name: String,
    cp_sa_suit: String,
    data:Buffer,
    contentType:String
  },
  {
    timestamps: true,
  }
);

const Pdf = mongoose.models.Pdf || mongoose.model("Pdf", pdfSchema);

export default Pdf;