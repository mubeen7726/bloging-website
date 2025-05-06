"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import { IoImageSharp } from "react-icons/io5";
import { format } from "date-fns";
import { use } from "react"; // Import React.use
import Image from "next/image";

const RichTextEditor = dynamic(
  () => import("@/app/components/EditRichTextEditor"),
  {
    ssr: false,
  }
);

type RichTextEditorHandle = {
  getContent: () => string;
  setContent: (html: string) => void;
};

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditBlog({ params }: { params: { id: string } }) {
  const { id } = use(params); // Unwrap params with React.use()

  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/idBlog/${id}`);
        const { data } = await res.json();
        setFormData(data);
        setPreviewUrl(data.imageUrl);
        editorRef.current?.setContent(data.content || "");
      } catch {
        console.log("Failed to load blog post");
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const content = editorRef.current?.getContent();
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !content ||
      content.trim() === "<p><br></p>"
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const updateData = new FormData();
      updateData.append("title", formData.title);
      updateData.append("description", formData.description);
      updateData.append("category", formData.category);
      updateData.append("content", content);
      if (image) updateData.append("image", image);
      if (formData.imagePublicId)
        updateData.append("imagePublicId", formData.imagePublicId);

      const res = await fetch(`/api/idBlog_update/${formData._id}`, {
        method: "PATCH",
        body: updateData,
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Update failed");
      }

      const { data: updated } = await res.json();
      setFormData(updated);
      setPreviewUrl(updated.imageUrl);
      toast.success("Blog updated successfully!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update blog"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!formData._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Blog Not Found</h2>
          <p className="text-gray-500 mb-4">
            Couldn’t load blog post for editing.
          </p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => router.push("/dashboard")}
          >
            <FiArrowLeft className="inline-block mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 md:px-10 bg-gray-100 dark:bg-zinc-900">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Edit Blog Post
      </h1>

      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-6 md:p-10 space-y-6">
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Post Title"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          placeholder="Category"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Short Description"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        {/* Image Preview */}
        <div className="flex items-center justify-center">
          {previewUrl ? (
            <label htmlFor="coverImage" className="w-40 cursor-pointer">
              <Image
                loading="lazy"
                width={100}
                height={100}
                src={previewUrl}
                alt="Preview"
                className="rounded-lg shadow-md w-full h-32 object-cover"
              />
            </label>
          ) : (
            <label
              htmlFor="coverImage"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer"
            >
              Upload Cover <IoImageSharp />
            </label>
          )}
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* RichTextEditor */}
        <div className="w-full">
          <RichTextEditor value={formData?.content} ref={editorRef} />
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Created:{" "}
            {formData.createdAt
              ? format(new Date(formData.createdAt), "PPP p")
              : "N/A"}
          </p>
          <p>
            Last Updated:{" "}
            {formData.updatedAt
              ? format(new Date(formData.updatedAt), "PPP p")
              : "N/A"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 border rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
            disabled={loading}
          >
            <FiArrowLeft className="inline-block mr-1" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FiSave className="inline-block mr-2" /> Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
