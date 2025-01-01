"use client"; // For React hooks

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result.ok) {
      setError("Invalid email or password");
    } else {
      // Redirect to the homepage or a secure area
      window.location.href = "/";
    }
  };

  return (
    <>
    
{/*  */}

<div className = "flex p-2 justify-between mt-auto mb-auto items-center border-b bg-white flex-wrap">
      <div className="flex ml-4 items-center">
        <img src="logo.png" alt="Logo" className="h-24" />
        <div className="relative items-center mt-auto mb-auto flex justify-center text-base mx-auto hidden md:inline-flex">
          <span className="rounded-md text-black text-center font-bold py-1 px-2 text-2xl">
          Welcome To Legal Dashboard
          </span>
        </div>
      </div>
    </div>

{/*  */}


    <div className="flex items-center justify-center min-h-screen  bg-white">
      <div className="bg-gray-200 p-8 rounded shadow-lg w-96">
    
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-gray-500 bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-gray-500 bg-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full  hover:bg-gray-700 bg-gray-600 text-white py-2 rounded "
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
}