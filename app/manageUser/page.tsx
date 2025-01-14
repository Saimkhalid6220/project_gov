"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import UpdatePasswordModal from "@/components/UpdatePasswordModal";
import { User } from "@/typings";
import { useToast } from "@/hooks/use-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const[isCursorBlock,setCursorBlock] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null);
  const[error,setError] = useState();
  const [editedData, setEditedData] = useState<User>();
  const [passwordModal, setPasswordModal] = useState({
    isOpen: false,
    userId: null,
  });

  const{ toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/Users");               
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedData(user);
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedData(
        {
            "_id":"",
            "name": "",
            "password":"",
            "email":"",
            "isAdmin": false,
        }
    );
  };

  const handleSave = async () => {
    setCursorBlock(true)
    toast({
        title:"saving user in the database",
        description:"please wait",
        variant:"default"
    })
    // Add the functionality to save edited data to the database
    try{

        const response = await fetch('/api/Users', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedData),
        });
        setEditingUserId(null); // Exit edit mode after saving
    } catch (error) {
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
    };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (_id) => {
    setCursorBlock(true)
    toast({
        title:"deleting user from the database",
        description:"please wait",
        variant:"default"
    })
    
    try {
        const response = await fetch('/api/Users', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify( _id ),
          });
      setUsers(users.filter((user) => user._id !== _id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error)
    } finally {
        setCursorBlock(false)
        if(error){
            toast({
                title:"error deleting user",
                description:"please try again",
                variant:"destructive"
            })
        } else {
            toast({
                title: "success",
                description: "user deleted successfully",
                variant: "success",
            })
        }
    }
  };

  const openPasswordModal = (userId) => {
    setPasswordModal({ isOpen: true, userId });
  };

  const closePasswordModal = () => {
    setPasswordModal({ isOpen: false, userId: null });
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Admin</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user,index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedData.name || ""}
                      onChange={handleFieldChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editingUserId === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editedData.email || ""}
                      onChange={handleFieldChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingUserId === user._id ? (
                    <select
                      name="isAdmin"
                      value={String(editedData.isAdmin) || "false"}
                      onChange={handleFieldChange}
                      className="border border-gray-300 p-2 rounded"
                    >
                      <option value={"true"}>Yes</option>
                      <option value={"false"}>No</option>
                    </select>
                  ) : (
                    user.isAdmin ? "Yes" : "No"
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingUserId === user._id ? (
                    <div className="flex justify-center">
                      <button
                        onClick={handleSave}
                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2 ${isCursorBlock?"cursor-not-allowed" : "cursor-auto"}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className={`bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ${isCursorBlock?"cursor-not-allowed" : "cursor-auto"}`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                         onClick={() => openPasswordModal(user._id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                      >
                        Update Password
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${isCursorBlock?"cursor-not-allowed" : "cursor-auto"}`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {passwordModal.isOpen && (
        <UpdatePasswordModal
          editedData={users.find((user)=>user._id==passwordModal.userId)}
          onClose={closePasswordModal}
        />
      )}
    </div>
  );
};

export default ManageUsers;
