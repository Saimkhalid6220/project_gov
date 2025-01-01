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
      await axios.post("/api/users", formData);
      // Handle success (e.g., redirect or show message)
    } catch (err) {
      setError("Error creating user");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-gray-200 p-8 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Create User</h1>
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
            className="w-full  hover:bg-gray-700 bg-gray-600 text-white py-2 rounded "
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;