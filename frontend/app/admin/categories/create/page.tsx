"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/categories",
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message
      );

      setName("");
      setDescription("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black p-10">
      <div className="max-w-xl mx-auto bg-zinc-900 p-8 rounded-xl">
        <h1 className="text-3xl text-white font-bold mb-6">
          Create Category
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full p-3 rounded bg-zinc-800 text-white"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full p-3 rounded bg-zinc-800 text-white"
          />

          <button
            type="submit"
            className="w-full bg-green-600 p-3 rounded text-white"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}