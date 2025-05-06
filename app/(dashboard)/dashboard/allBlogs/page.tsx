"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/components/Loading";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { MdDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { Toggle } from "@/components/ui/toggle";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// ✅ Types
interface Article {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  UserImage: string;
  UserName: string;
  live: boolean;
  category: string;
  slug: string;
}

interface ArticlesAPIResponse {
  posts: Article[];
}

interface CustomError extends Error {
  message: string;
}

interface DeleteResponse {
  message: string;
  success?: boolean;
}

interface ToggleResponse {
  message: string;
  updated?: boolean;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleArticles, setVisibleArticles] = useState(10);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);

  const pageTitle = "Tech Blog | Latest Articles on Gadgets and Technology";
  const pageDescription =
    "Discover the latest tech reviews, comparisons and buying guides for laptops, mobiles and bikes.";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/dashboard/onlyDashboard_article", {
          next: { revalidate: 10600 },
        });
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data: ArticlesAPIResponse = await res.json();
        setArticles(data.posts || []);
      } catch (err: unknown) {
        const error = err as CustomError;
        console.error("Error fetching articles:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const toggle = async (postId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/dashboard/liveBlog/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ live: !currentStatus }),
      });

      const data: ToggleResponse = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update the article.");

      toast.success("Article status updated successfully!");
      setArticles((prev) =>
        prev.map((article) =>
          article._id === postId
            ? { ...article, live: !currentStatus }
            : article
        )
      );
    } catch (err: unknown) {
      const error = err as CustomError;
      console.error("Toggle Error:", error.message);
      toast.error(error.message || "Something went wrong while updating.");
    }
  };

  const deletePost = async (postId: string, imagePublicId: string) => {
    try {
      const res = await fetch(`/api/deleteBlog/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePublicId }),
      });

      const data: DeleteResponse = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to delete the post.");

      toast.success("Post deleted successfully!");
      setArticles((prev) => prev.filter((article) => article._id !== postId));
    } catch (err: unknown) {
      const error = err as CustomError;
      console.error("Delete Error:", error.message);
      toast.error(error.message || "Something went wrong while deleting.");
    }
  };

  const categories = useMemo(
    () => ["All Categories", ...new Set(articles.map((a) => a.category))],
    [articles]
  );

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          article.title.toLowerCase().includes(query) ||
          article.UserName.toLowerCase().includes(query); 
        const matchesCategory =
          !selectedCategory || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [articles, searchQuery, selectedCategory]
  );
  

  const loadMoreArticles = () => {
    const nextVisibleCount = visibleArticles + 5;
    if (nextVisibleCount >= filteredArticles.length) {
      setAllArticlesLoaded(true);
    }
    setVisibleArticles(nextVisibleCount);
  };

  useEffect(() => {
    setVisibleArticles(5);
    setAllArticlesLoaded(false);
  }, [searchQuery, selectedCategory]);

  if (loading) return <Loading aria-live="polite" />;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/blog" />
      </Head>

      <main className="mt-10 p-6 md:p-10 dark:bg-zinc-800 bg-white min-h-screen">
        <section
          aria-labelledby="search-heading"
          className="mb-10 max-w-2xl mx-auto"
        >
          <h2 id="search-heading" className="sr-only">
            Article Search
          </h2>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search articles..."
            className="w-full px-5 py-3 text-base border dark:placeholder:text-white dark:bg-gray-500 border-blue-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-white"
            aria-label="Search articles by title"
            aria-controls="articles-list"
          />
        </section>

        <div className="md:flex items-center justify-end hidden mb-4 mr-3">
          <strong className="text-xl dark:text-white text-gray-800 mr-2 mb-[3px]">
            Total articles:
          </strong>
          <h1 className="text-md text-gray-900 font-bold dark:text-white">
            {filteredArticles.length}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold dark:text-white text-slate-800 tracking-tight">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <label
              htmlFor="category"
              className="text-sm dark:text-white font-medium text-gray-700"
            >
              Filter by:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border dark:bg-zinc-700 dark:text-white border-blue-300 shadow-sm bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              aria-label="Filter articles by category"
            >
              {categories.map((category) => (
                <option
                  key={`cat-${category}`}
                  value={category === "All Categories" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="flex md:hidden items-center justify-end">
              <strong className="text-sm dark:text-white text-gray-800">
                Total articles:{" "}
              </strong>
              <h1 className="text-md dark:text-white text-gray-900">
                {filteredArticles.length}
              </h1>
            </div>
          </div>
        </div>

        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" className="py-10 sr-only">
            Articles List
          </h2>
          <div
            id="articles-list"
            className="flex flex-col"
            role="list"
            aria-live="polite"
          >
            {filteredArticles.length > 0 ? (
              filteredArticles.slice(0, visibleArticles).map((article) => (
                <article
                  key={`article-${article._id}`}
                  className="bg-white dark:bg-zinc-700 flex my-1 rounded-xl border border-gray-200 p-2 shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  <div className="flex flex-col items-start  justify-evenly">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-35 h-25 object-contain rounded-md"
                    priority={false}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex justify-start items-center gap-3">
                    <Image
                      alt={article.title}
                      src={article.UserImage}
                      width={100}
                      height={100}
                      className="w-8 h-8 rounded-full"
                    />
                    <h1 className="text-sm fonts-date ">{article.UserName}</h1>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="text-xl dark:text-white font-semibold text-gray-800 mb-2"
                      itemProp="headline"
                    >
                      {article.title}
                    </h3>
                    <p
                      className="text-gray-600 dark:text-gray-200 mb-3 flex-1 text-sm leading-relaxed"
                      itemProp="description"
                    >
                      {article.description.split(" ").slice(0, 20).join(" ")}
                      {article.description.split(" ").length > 20 && "..."}
                    </p>
                    <div className="text-sm dark:text-white text-blue-500 mb-4 font-medium">
                      Category: <span itemProp="genre">{article.category}</span>
                    </div>
                    <Link
                      href={`/article/${article.slug || article._id}`}
                      className="text-blue-600 dark:text-white hover:text-blue-800 hover:underline underline-offset-8 font-medium transition-colors duration-200"
                      aria-label={`Read more about ${article.title}`}
                      itemProp="url"
                    >
                      Show More →
                    </Link>
                  </div>

                  <div className="flex items-end mr-3 mb-4 gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger className="bg-red-400 hover:bg-red-500 py-3 px-4 rounded-md cursor-pointer transition-all duration-300">
                        <MdDeleteForever />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your article.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-400 hover:bg-red-600 transition-all duration-300"
                            onClick={() =>
                              deletePost(article._id, article.imagePublicId)
                            }
                          >
                            <MdDeleteForever /> Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Link href={`/dashboard/edit_Blog/${article._id}`}>
                      <Button className="bg-blue-400 hover:bg-blue-500 transition-all duration-300">
                        <CiEdit />
                      </Button>
                    </Link>

                    <Toggle
                      pressed={article.live}
                      onClick={() => toggle(article._id, article.live)}
                      className="text-white bg-gray-700 hover:bg-gray-900 p-2 rounded-md transition-all"
                      aria-label="Toggle live status"
                    >
                      {article.live ? <FaEye /> : <FaEyeSlash />}
                    </Toggle>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-10" role="alert">
                <p className="text-gray-500">
                  No articles found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {!allArticlesLoaded && filteredArticles.length > visibleArticles && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreArticles}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Load more articles"
            >
              Load More
            </button>
          </div>
        )}

        {allArticlesLoaded && (
          <div className="text-center mt-8 text-gray-500">
            You have reached the end of the list.
          </div>
        )}
      </main>
    </>
  );
}
