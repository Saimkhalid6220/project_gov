import Link from "next/link";
import Excel from "@/components/features/excel";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";


export default async function Dashboard() {


  return (
    <>
    
        <Navbar/>
        <Excel />
      
    </>
  );
}
