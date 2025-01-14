import { NextResponse } from 'next/server';
import Pdf from '@/models/pdf';

export async function GET() {
    try {
      // Fetch all documents from the Pdf collection
      const pdfs = await Pdf.find({}, 'pdfId'); // Retrieve only the `cp_sa_suit` field
  
      // Map the result to return only the `cp_sa_suit` array
      const cpSaSuits = pdfs.map((pdf) => pdf.pdfId);
  
      // Return the array as JSON
      return NextResponse.json(cpSaSuits, { status: 200 });
    } catch (error) {
      console.error("Error fetching cp_sa_suits:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  