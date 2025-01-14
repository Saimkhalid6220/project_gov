import { NextResponse } from 'next/server';
import Pdf from '@/models/pdf';

export async function DELETE(req, { params }) {
  const { id } = params; // Extract the PDF ID from the route params
  const decodedId = decodeURIComponent(id);

  if (!decodedId) {
    return NextResponse.json({ message: "PDF ID is required" }, { status: 400 });
  }

  try {
    // Attempt to delete the PDF document by ID
    const deletedPdf = await Pdf.findOneAndDelete({ pdfId: decodedId });

    if (!deletedPdf) {
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
