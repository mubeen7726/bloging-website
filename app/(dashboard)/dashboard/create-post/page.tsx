"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { IoImageSharp } from "react-icons/io5";
import { toast } from "sonner";
const RichTextEditor = dynamic(
  () => import("@/app/components/RichTextEditot"),
  {
    ssr: false,
  }
);

type RichTextEditorHandle = {
  getContent: () => string;
};

export default function CreatePost() {
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const content = editorRef.current?.getContent();

    // localStorage data User

    const User = localStorage.getItem("User");
    if (!User) {
      console.log("User not found");
    } else {
      console.log("User found", User);
    }

    if (
      !User ||
      !title ||
      !description ||
      !coverImage ||
      !content ||
      content.trim() === "<p><br></p>"
    ) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("coverImage", coverImage);
    formData.append("category", category);
    formData.append("user", User);
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/postBlog", {
        method: "POST",
        body: formData,
      });
      setLoading(false);
      if (res.status === 201) {
        console.log("response:>", res);
        toast.success("Post created successfully!");
        setTitle("");
        setDescription("");
        setCoverImage(null);
        setCategory("");
      }
      if (res.status === 500) {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error posting blog.");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 md:px-10 dark:bg-zinc-900 bg-gray-100">
      <h1 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl mb-8 text-gray-800 dark:text-white">
        Create New Blog Post
      </h1>

      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-6 md:p-10 space-y-6 transition-all">
        <input
          type="text"
          placeholder="Post Title"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Post Category"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Short Description"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-center">
          {coverImage ? (
            <div className="flex items-center justify-center">
              <label htmlFor="coverImage" className="w-full mb-4">
                <Image
                  loading="lazy"
                  width={100}
                  height={100}
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover Preview"
                  className="w-30 h-20  my-2 rounded-lg shadow-md"
                />
              </label>
            </div>
          ) : (
            <>
              <label
                htmlFor="coverImage"
                className=" flex items-center cursor-pointer justify-around min-w-25 max-w-40 text-sm gap-3 text-gray-50 hover:text-gray-100  bg-blue-500 transition-all duration-300  hover:bg-600 rounded-lg hover:shadow-sm shadow-black py-3 px-4"
              >
                Cover image <IoImageSharp className="" />
              </label>
              <input
                type="file"
                accept="image/*"
                id="coverImage"
                className="w-full hidden text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              />
            </>
          )}
        </div>
        <div className="w-full">
          <RichTextEditor ref={editorRef} />
        </div>
        <div className="flex items-center justify-center">
          {!loading ? (
            <button
              onClick={handleSubmit}
              className="w-40 h-10  cursor-pointer bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white text-lg font-semibold rounded-xl shadow-sm"
            >
              Submit Post
            </button>
          ) : (
            <button className=" w-40 h-10 py-2 px-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white text-lg font-semibold rounded-xl shadow-sm">
              <div className="w-6 h-6 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
