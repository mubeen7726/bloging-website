"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import Loading from "@/app/components/Loading";
import { MoveLeft, Heart } from "lucide-react";

interface Props {
  params: { id: string };
}

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  UserImage: string;
  UserName: string;
  imageUrl: string;
  createdAt: string;
}

const ArticlePage = ({ params }: Props) => {
  const { id } = React.use(params);

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishId, setWishId] = useState<string | null>();

  const fetchUser = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("User");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && typeof parsed === "object") {
            setUserId(parsed._id || parsed.userId || null);
          }
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
        }
      }
    }
  }, []);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/idBlog/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      const json = await res.json();
      setBlog(json.data);
    } catch (error) {
      console.error("Blog fetch error:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchWishlistStatus = useCallback(async () => {
    if (!id || !userId) return;
    try {
      const res = await fetch("/api/checkBlogpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId }),
      });
      const data = await res.json();
      await setWishId(data.data?._id);
      if (data.status === 600) {
        setLiked(true);
        setWishlistId(data._id);
      } else {
        setLiked(false);
        setWishlistId(null);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (userId) fetchWishlistStatus();
  }, [userId, fetchWishlistStatus]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleWishlist = useCallback(async () => {
    if (!userId) {
      alert("Please login to manage wishlist.");
      return;
    }
    if (!blog) return;

    try {
      if (liked && wishlistId) {
        const success = await deleteItem(wishlistId);
        if (success) {
          setLiked(false);
          setWishlistId(null);
        }
      } else {
        const res = await fetch("/api/wishList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            blogId: blog._id,
            image: blog.imageUrl,
            title: blog.title,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setLiked(true);
          setWishlistId(data.data?._id);
        } else if (res.status === 409) {
          await deleteItem(wishId);
          setLiked(false);
        }
      }
    } catch (error) {
      console.error("Wishlist operation error:", error);
    }
  }, [ userId, blog, liked, wishlistId]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/deleteWishlis/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to remove item");
      }
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
    }
  }, []);

  if (loading) return <Loading />;

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-zinc-800 bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            We could not find the blog you were looking for.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-800 dark:text-white text-gray-800">
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold leading-tight tracking-tight mb-4 text-center sm:text-5xl">
          {blog.title}
        </h1>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-10">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {Math.ceil(blog.description.split(" ").length / 200)} min read
        </div>

        <div className="relative w-full h-64 sm:h-96 overflow-hidden rounded-xl shadow-lg mb-12">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className={`object-cover transition duration-1000 ease-in-out ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            onLoadingComplete={() => setImageLoaded(true)}
            priority
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-700 animate-pulse"></div>
          )}
        </div>

        <div className="flex justify-start items-center gap-4 my-10">
          <Image
            className="w-8 h-8 rounded-full"
            src={blog.UserImage}
            width={32}
            height={32}
            alt={blog.UserName || "User"}
          />
          <h1 className="text-md">{blog.UserName}</h1>

          <button
            onClick={handleWishlist}
            className="ml-4 text-red-500 hover:text-red-600 transition"
            title={liked ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        <article className="prose prose-lg max-w-none dark:prose-invert">
          <p>{blog.description}</p>
        </article>

        <div
          className="flex items-center justify-center mt-8 mb-8 flex-col gap-4 prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
          >
            <MoveLeft className="mr-2 font-bold" /> Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ArticlePage;
