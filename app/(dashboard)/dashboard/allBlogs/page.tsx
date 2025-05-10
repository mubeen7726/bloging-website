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

      <main className="mt-4 md:mt-10 p-4 md:p-10 dark:bg-zinc-900 bg-white min-h-screen">
        <section
          aria-labelledby="search-heading"
          className="mb-6 md:mb-10 w-full max-w-2xl mx-auto"
        >
          <h2 id="search-heading" className="sr-only">
            Article Search
          </h2>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search articles..."
            className="w-full px-4 py-2 md:px-5 md:py-3 text-sm md:text-base border dark:placeholder:text-gray-300 dark:bg-zinc-800 dark:border-zinc-600 border-blue-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-white"
            aria-label="Search articles by title"
            aria-controls="articles-list"
          />
        </section>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-bold dark:text-white text-slate-800 tracking-tight">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base dark:text-gray-300 font-medium">
              {filteredArticles.length} articles
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto flex items-center gap-3">
            <label
              htmlFor="category"
              className="text-sm dark:text-gray-300 font-medium text-gray-700 whitespace-nowrap"
            >
              Filter by:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-600 border-blue-300 shadow-sm bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
          </div>
        </div>

        <section aria-labelledby="articles-heading" className="mb-8">
          <h2 id="articles-heading" className="sr-only">
            Articles List
          </h2>
          <div
            id="articles-list"
            className="grid gap-4 md:gap-6"
            role="list"
            aria-live="polite"
          >
            {filteredArticles.length > 0 ? (
              filteredArticles.slice(0, visibleArticles).map((article) => (
                <article
                  key={`article-${article._id}`}
                  className="bg-white dark:bg-zinc-800 flex flex-col md:flex-row rounded-xl border border-gray-200 dark:border-zinc-700 p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  <div className="flex flex-col items-start mb-3 md:mb-0 md:mr-4">
                    <div className="w-full md:w-40 h-32 relative">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover rounded-md"
                        priority={false}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex justify-start items-center gap-2 mt-2">
                      <div className="w-6 h-6 relative">
                        <Image
                          alt={article.title}
                          src={article.UserImage}
                          fill
                          className="rounded-full"
                        />
                      </div>
                      <span className="text-xs fonts-date dark:text-gray-300">
                        {article.UserName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="p-2 md:p-3 flex-1">
                      <h3
                        className="text-lg md:text-xl dark:text-white font-semibold text-gray-800 mb-1 md:mb-2"
                        itemProp="headline"
                      >
                        {article.title}
                      </h3>
                      <p
                        className="text-gray-600 dark:text-gray-300 mb-2 md:mb-3 text-xs md:text-sm leading-relaxed line-clamp-2"
                        itemProp="description"
                      >
                        {article.description}
                      </p>
                      <div className="text-xs md:text-sm dark:text-gray-400 text-blue-500 mb-2 font-medium">
                        Category: <span itemProp="genre">{article.category}</span>
                      </div>
                      <Link
                        href={`/article/${article.slug || article._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline underline-offset-4 text-sm font-medium transition-colors duration-200 inline-block mt-1"
                        aria-label={`Read more about ${article.title}`}
                        itemProp="url"
                      >
                        Show More →
                      </Link>
                    </div>

                    <div className="flex justify-end items-center gap-2 mt-2 p-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-2 md:px-3"
                            aria-label="Delete article"
                          >
                            <MdDeleteForever className="text-lg" />
                            <span className="sr-only md:not-sr-only md:ml-1">
                              Delete
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark:bg-zinc-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="dark:text-white">
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-gray-300">
                              This action cannot be undone. This will permanently
                              delete your article.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-all duration-300"
                              onClick={() =>
                                deletePost(article._id, article.imagePublicId)
                              }
                            >
                              <MdDeleteForever className="mr-1" />
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Link href={`/dashboard/edit_Blog/${article._id}`}>
                        <Button
                          size="sm"
                          className="h-8 px-2 md:px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                          <CiEdit className="text-lg" />
                          <span className="sr-only md:not-sr-only md:ml-1">
                            Edit
                          </span>
                        </Button>
                      </Link>

                      <Toggle
                        pressed={article.live}
                        onPressedChange={() => toggle(article._id, article.live)}
                        size="sm"
                        className="h-8 px-2 md:px-3 bg-gray-700 hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 data-[state=on]:bg-green-600 data-[state=on]:hover:bg-green-700"
                        aria-label={article.live ? "Article is live" : "Article is hidden"}
                      >
                        {article.live ? (
                          <FaEye className="text-white" />
                        ) : (
                          <FaEyeSlash className="text-white" />
                        )}
                        <span className="sr-only md:not-sr-only md:ml-1">
                          {article.live ? "Live" : "Hidden"}
                        </span>
                      </Toggle>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-10" role="alert">
                <p className="text-gray-500 dark:text-gray-400">
                  No articles found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {!allArticlesLoaded && filteredArticles.length > visibleArticles && (
          <div className="text-center mt-6">
            <button
              onClick={loadMoreArticles}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Load more articles"
            >
              Load More
            </button>
          </div>
        )}

        {allArticlesLoaded && (
          <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
            You have reached the end of the list.
          </div>
        )}
      </main>
    </>
  );
}