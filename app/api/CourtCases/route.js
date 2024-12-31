import CourtCases from "@/(models)/courtCases";
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
    return NextResponse.json({ message: "Court Case Created." }, { status: 201 });
    console.log("Court Case Created.");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
