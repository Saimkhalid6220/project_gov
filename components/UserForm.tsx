"use client";

import React, { useState } from "react";
import axios from "axios";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/Users", formData);
      // Show success alert
      alert("User created successfully!");
      // Redirect or perform additional actions
    } catch (err) {
      setError("Error creating user");
    } finally {
      window.location.href = "/";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center sm:bg-none md:bg-none lg:bg-cover"
      style={{
        backgroundImage: "url('/userformlogo.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div
          className="absolute top-1/2 transform -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-96"
          style={{ right: "10%" }}
        >
          <h1 className="text-2xl font-bold text-black mb-6 text-center">
            Create User
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-green-500 bg-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-green-500 bg-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-green-500 bg-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full hover:bg-gray-700 bg-gray-600 text-white py-2 rounded"
            >
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
