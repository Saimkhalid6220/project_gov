import CourtCases from "../../../models/courtCases";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { options } from "../auth/[...nextauth]/options";


export async function POST(req) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json({ message: "You are not logged in" }, { status: 401 });

  try {
    const courtCaseData = await req.json();

    // Confirm data exists
    if (!courtCaseData) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await CourtCases.create(courtCaseData);
    console.log("Court Case Created.");
    return NextResponse.json({ message: "Court Case Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(options);
  if (!session) return NextResponse.json({ message: "You are not logged in" }, { status: 401 });

  try {
    // Define the fields to select
    const fieldsToSelect = {
      _id: 1,
      date_of_hearing: 1,
      cp_sa_suit: 1,
      subject: 1,
      petitioner: 1,
      court: 1,
      concerned_office: 1,
      comments: 1,
      last_hearing_date: 1,
      remarks: 1,
    };

    // Fetch data from the database with the required fields only
    const courtCases = await CourtCases.find({}, fieldsToSelect).sort({ sr_no: 1 });

    return NextResponse.json(courtCases, { status: 200 });
  } catch (error) {
    console.error("Error fetching court cases:", error);
    return NextResponse.json({ message: "Error fetching court cases", error }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(options);
  if (!session.user.role) return NextResponse.json({ message: "You are not alowed" }, { status: 401 });

  try {
    const  updatedData  = await req.json(); // Extract sr_no and updateData from the request body

    if (!updatedData) {
      return NextResponse.json({ message: "sr_no and updateData are required" }, { status: 400 });
    }

    const _id = updatedData._id;

    const updatedCase = await CourtCases.findOneAndUpdate(
      { _id }, // Filter by cp_sa_suit
      { $set: updatedData }, // Fields to update
      { new: true, runValidators: true } // Return the updated document and validate inputs
    );

    if (!updatedCase) {
      return NextResponse.json({ message: "Case with given sr_no not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Case updated successfully", data: updatedCase }, { status: 200 });
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(options);
  if (!session.user.role) return NextResponse.json({ message: "You are not allowed" }, { status: 401 });
  try {
    // Extract sr_no from the request body
    const { cp_sa_suit } = await req.json();

    if (!cp_sa_suit) {
      return NextResponse.json({ message: "sr_no is required" }, { status: 400 });
    }

    // Find and delete the case by sr_no
    const deletedCase = await CourtCases.findOneAndDelete({ _id:cp_sa_suit });

    if (!deletedCase) {
      return NextResponse.json({ message: "Case with given sr_no not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Case deleted successfully", data: deletedCase }, { status: 200 });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
