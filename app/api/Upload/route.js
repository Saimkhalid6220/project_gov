
import { NextResponse } from 'next/server';
import Pdf from '@/models/pdf';
import { cp } from 'fs';
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req){

    const data = await req.formData();
    const file = data.get("file");
    const cp_sa_suit = data.get("cp_sa_suit");

    if(!file) return NextResponse.json({message: "File is required"}, {status: 400})

    try{
        await connectToDatabase();
        
        const bytes = await file.arrayBuffer();
        const bufferData = Buffer.from(bytes);
        
        const newPDF = new Pdf({
            name:file.name,
            pdfId:cp_sa_suit,
            data:bufferData,
            contentType:file.type
        })
        await newPDF.save();
        
        return NextResponse.json({message: "File uploaded successfully", data: newPDF._id}, {status: 200})
    } 
    
    catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }

}

