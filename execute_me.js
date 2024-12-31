import mongoose from "mongoose";
import CourtCases from "@/(models)/courtCases"; // Adjust the path to your model
import * as XLSX from "xlsx";
import path from "path";

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Import Data Function
const importDataFromExcel = async () => {
  try {
    // Specify the path to your Excel file
    const filePath = path.resolve("./public/DATA.xlsx"); // Replace with the actual path

    // Parse the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    console.log("Parsed Excel Data:", jsonData);

    // Save each row in the database
    for (const row of jsonData) {
      const newCase = new CourtCases({
        sr_no: row["Sr No"], // Adjust based on column names in Excel
        date_of_hearing: row["Date of Hearing"],
        cp_sa_suit: row["CP/SA/Suit"],
        subject: row["Subject"],
        petitioner: row["Petitioner"],
        court: row["Court"],
        concerned_office: row["Concerned Office"],
        comments: row["Comments"],
        last_hearing_date: row["Last Hearing Date"],
        remarks: row["Remarks"],
      });
      await newCase.save();
    }

    console.log("Data successfully imported into MongoDB!");
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    // mongoose.connection.close();
    console.log("done")
  }
};

// Run the Script
(async () => {
  await connectDB();
  await importDataFromExcel();
})();
