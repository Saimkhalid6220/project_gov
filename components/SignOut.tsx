"use client";

import { signOut } from "next-auth/react";
import React from "react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "https://education-dashboard-silk.vercel.app/" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-gray-200 p-8 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Log Out</h1>
        <p className="text-center text-black mb-6">Are you sure you want to Log out?</p>
        <button
          onClick={handleSignOut}
          className="w-full  hover:bg-gray-700 bg-gray-600 text-white py-2 rounded "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SignOut;