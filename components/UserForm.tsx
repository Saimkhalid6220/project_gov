"use client";

import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin:""
  });
  const [error, setError] = useState("");
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast({
      title: "Creating User....",
      description: "Friday, February 10, 2023 at 5:57 PM",
      variant:"default"
    })
    try {
      await axios.post("/api/Users", formData);
    } catch (err) {
      
      setError("Error creating user");
    } 
    finally {
      if(!error){
        toast({
          title: "User created Sucessfully",
          description: "Friday, February 10, 2023 at 5:57 PM",
          variant:"success"
        })
      } else {
        toast({
          title: "Error creating user",
          description: "Friday, February 10, 2023 at 5:57 PM",
          variant:"destructive",
        })
      }
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
      className="relative destr flex items-center justify-center min-h-screen bg-cover bg-center sm:bg-none md:bg-none lg:bg-cover"
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
            <div className="flex space-x-3">
             <label htmlFor="admin">
                <input
                  type="radio"
                  name="isAdmin"
                  id="admin"
                  value="true"
                  onChange={handleChange}
                  checked={formData.isAdmin === "true"}
                />
                Admin
              </label>
              <label htmlFor="user">
                <input
                  type="radio"
                  name="isAdmin"
                  id="user"
                  value="false"
                  onChange={handleChange}
                  checked={formData.isAdmin === "false"}
                />
                User
              </label>
            </div>
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
