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
            className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-green-500 bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-green-500 bg-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}