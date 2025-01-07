import { NextResponse } from 'next/server';
import Pdf from '@/(models)/pdf';


export async function GET(req, { params }) {
    const { id } = await params; // Extract the PDF ID from the route params
    console.log(id);
  
    try {
      const pdf = await Pdf.findById(id);
  
      if (!pdf) {
        return NextResponse.json({ message: "PDF not found" }, { status: 404 });
      }
  
      // Respond with the binary data directly
      return new Response(pdf.data, {
        headers: {
          'Content-Type': pdf.contentType, // Tell the browser it's a PDF
          'Content-Disposition': `inline; filename="${pdf.name}"`, // Render in browser
        },
      });
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }