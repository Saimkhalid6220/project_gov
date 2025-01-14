import User from "../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";


export async function POST(req) {
  const session = await getServerSession(options);
  if (!session.user.role) return NextResponse.json({ message: "You are not allowed" }, { status: 401 });
  try {
    const userData = await req.json();

    //Confirm data exists
    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // check for duplicate emails
    
    const duplicate = await User.findOne({ email: userData.email })
    .lean()
    .exec();
    
    if (duplicate) {
      return NextResponse.json({ message: "Duplicate Email" }, { status: 409 });
    }
    
      const hashPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashPassword;
      
      await User.create(userData);
      
      return NextResponse.json({ message: "User Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
export async function GET(req) {
  const session = await getServerSession(options);
  if (!session.user.role) return NextResponse.json({ message: "You are not allowed" }, { status: 401 });

  try{

    const users = await User.find({});
    if (!users) {
      return NextResponse.json({ message: "No Users found." }, { status: 404 });
    } else {
      return NextResponse.json(users, { status: 201 });
    }
  } catch(err){
    console.log(err);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
    
}

export async function PATCH(req) {
  const session = await getServerSession(options);
  if (!session.user.role) return NextResponse.json({ message: "You are not alowed" }, { status: 401 });

  try {
    const  editedData  = await req.json(); // Extract sr_no and updateData from the request body
    console.log(editedData);

    if (!editedData) {
      return NextResponse.json({ message: "sr_no and updateData are required" }, { status: 400 });
    }
    const _id = editedData._id;
    if(editedData.password){
      const hashPassword = await bcrypt.hash(editedData.password, 10);
      editedData.password = hashPassword
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id }, 
      { $set: editedData }, // Fields to update
      { new: true, runValidators: true } // Return the updated document and validate inputs
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "user with given _id not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "user updated successfully", data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(options);
  if (!session.user.role) return NextResponse.json({ message: "You are not allowed" }, { status: 401 });
  try {

    const _id = await req.json();
    // console.log(_id);

    if (!_id) {
      return NextResponse.json({ message: "sr_no is required" }, { status: 400 });
    }

    // Find and delete the case by sr_no
    const deletedUser = await User.findOneAndDelete({ _id });

    if (!deletedUser) {
      return NextResponse.json({ message: "Case with given id not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Case deleted successfully", data: deletedUser }, { status: 200 });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}