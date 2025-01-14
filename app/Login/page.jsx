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
      window.location.href = "https://education-dashboard-silk.vercel.app/";
    }
  };

  return (
    <>
      <div
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center sm:bg-none md:bg-none lg:bg-cover"
        style={{
          backgroundImage: "url('/bglogo.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          className="absolute top-1/2 transform -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-96"
          style={{ right: "10%" }} // Adjust this value to move the form left or right
        >
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
              className="w-full hover:bg-gray-700 bg-gray-600 text-white py-2 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
