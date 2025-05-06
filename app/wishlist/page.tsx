"use client";

import React, { useEffect, useState } from "react";
import { wishlistType } from "@/types/wishlistType";
import Loading from "../components/Loading";
import Image from "next/image";
import { DeleteIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaBoxOpen } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WishlistPage() {
  const [data, setData] = useState<wishlistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = localStorage.getItem("User");
        if (!user) throw new Error("User not found in localStorage");

        const parsedUser = JSON.parse(user);
        const userId = parsedUser?._id;

        if (!userId) throw new Error("User ID missing");

        const res = await fetch(`/api/getWishList?userId=${userId}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch wishlist");
        }

        setData(result.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const deleteItem = async (id: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/deleteWishlis/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to remove item");
      }

      setData((prev) => prev.filter((item) => item.blogId !== id));
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to remove item from wishlist");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-red-500 text-lg font-medium">
        {error}
      </div>
    );

  if (data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-500 text-lg font-medium">
        <FaBoxOpen size={200} />
        Your wishlist is empty
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
        My Wishlist
      </h1>

      <TooltipProvider>
        <div className="space-y-4">
          {data.map((item, index) => (
            <motion.div
              key={item.blogId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white dark:bg-zinc-700 border rounded-xl shadow hover:shadow-md transition-shadow flex justify-between items-center gap-4"
            >
              <div className="flex gap-4 items-center flex-1">
                <Image
                  src={item.image}
                  width={100}
                  height={100}
                  alt={item.title}
                  className="rounded-lg object-cover w-24 h-24"
                />
                <div className="flex flex-col">
                  <h2 className="font-medium dark:text-white text-gray-800 line-clamp-2 text-sm sm:text-base">
                    {item.title}
                  </h2>
                  <Link
                    href={`/article/${item.blogId}`}
                    className="text-blue-600 fonts-date underline underline-offset-2 hover:text-[0.9rem] transition-all duration-200 hover:text-blue-800 font-medium text-sm"
                  >
                    Show Blog
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => deleteItem(item.blogId)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </TooltipTrigger >
                  <TooltipContent >
                    <p  className="fonts-date">Delete</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
