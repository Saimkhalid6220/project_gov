import React from 'react'
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from "@/app/api/auth/[...nextauth]/options"

export default async function Navbar() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  return (
    <>


      <div className="flex p-2  justify-between mt-auto mb-auto items-center border-b bg-white flex-wrap">
        <div className="flex ml-4 items-center">

          <img src="logo.png" alt="Logo" className="h-24" />

          <div className="relative items-center mt-auto mb-auto flex justify-center text-base mx-auto hidden md:inline-flex">
          <span className="rounded-md text-black text-center font-bold py-1 px-2 text-2xl">School Education & Literacy Department 
            Legal Dashboard</span>
        </div>


        </div>
       


        <div className="md:ml-auto flex mt-auto mb-auto mr-4 flex-wrap items-center text-base justify-center">
          <Link href="/createUser">
          <button className="inline-flex items-center bg-gray-600 text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0 mr-2">
              Create User
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
          <Link href="./Logout">
            <button className="inline-flex items-center  bg-gray-600 text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">
              Logout
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </div>




    </>
  );
}





{/* <div class="flex p-2 justify-between items-center border-b border-gray-300 flex-wrap">
<div class="flex items-center">
    <img src="https://tailwindflex.com/public/images/logo.svg" class="w-10 h-10">
    <h2 class="font-bold text-2xl text-purple-600">TailwildFlex</h2>
</div>
<div class="relative flex items-center hidden md:inline-flex">
    <input type="text" placeholder="Search" class="border border-gray-200 rounded-md py-1 px-2"/>
    <svg class="absolute right-2 h-6 w-6 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
</div>
<div class="flex items-center gap-2">
    <button class="border px-2 py-1 rounded-md">Center</button>
    <button class="border px-2 py-1 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 hover:text-gray-500 text-gray-700" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    </button>
    <button class="border px-2 py-1 rounded-md text-gray-500">Tailwind V3</button>
    <button class="border px-2 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700">Save</button>
</div>
</div> */}