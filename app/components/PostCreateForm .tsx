"use client";

import React, { useState } from "react";
import { FiImage, FiLoader } from "react-icons/fi";
import { toast } from "sonner";

const  PostCreateForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !file) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const res = await fetch("/api/dashboard/postBlog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Post created successfully!");
        setTitle("");
        setDescription("");
        setCategory("");
        setFile(null);
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error!");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 dark:bg-zinc-700 bg-white rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Create New Blog Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Description */}
        <textarea
          placeholder="Post Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* File Input */}
        <label className="flex items-center gap-3 cursor-pointer bg-blue-50 border border-dashed border-blue-300 p-4 rounded-xl text-blue-700 hover:bg-blue-100 transition">
          <FiImage className="text-xl" />
          <span>{file ? file.name : "Choose an image (JPG, PNG, WEBP)"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            hidden
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <FiLoader className="animate-spin" />
              Submitting...
            </span>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostCreateForm;
