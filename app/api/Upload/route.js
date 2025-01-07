
import { NextResponse } from 'next/server';
import Pdf from '@/(models)/pdf';

export async function POST(req){

    const data = await req.formData();
    const file = data.get("file");

    if(!file) return NextResponse.json({message: "File is required"}, {status: 400})

    try{

        
        const bytes = await file.arrayBuffer();
        const bufferData = Buffer.from(bytes);
        
        const newPDF = new Pdf({
            name:file.name,
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

