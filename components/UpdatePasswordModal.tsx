'use client'
import React, { useState } from "react";
import { UserPass } from "@/typings";
import { useToast } from "@/hooks/use-toast";

const UpdatePasswordModal = ({ editedData, onClose }:{editedData:UserPass,onClose:()=>void}) => {
  const [password, setPassword] = useState("");
  const [isCursorBlock,setCursorBlock] = useState(false)
  const [error,setError] = useState()

  const {toast} = useToast()

  const handleSubmit = async (e:any) => {
      e.preventDefault();
      setCursorBlock(true)
      toast({
        title:"saving user in the database",
        description:"please wait",
        variant:"default"
    })

    editedData.password = password

    try{

        await fetch('/api/Users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedData),
        });
    } catch(error){
        console.error("Error updating user:", error);
        setError(error)
    } finally {
        setCursorBlock(false)
        if(error){
            toast({
                title:"error updating user",
                description:"please try again",
                variant:"destructive"
            })
        } else {
            toast({
                title: "success",
                description: "user updated successfully",
                variant: "success",
            })
        }
    }
        onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isCursorBlock?"cursor-not-allowed" : "cursor-auto"}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg w-80 ${isCursorBlock?"cursor-not-allowed" : "cursor-auto"}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Password</h2>
        <form onSubmit={handleSubmit} className={isCursorBlock?"cursor-not-allowed" : "cursor-auto"}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded text-black focus:outline-none focus:ring focus:ring-green-500 mb-4"
          />
          <div className={`flex justify-end space-x-3 ${isCursorBlock?"cursor-not-allowed" : "cursor-auto"}`}>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 text-sm rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 text-sm rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
