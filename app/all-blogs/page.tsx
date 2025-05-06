"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/components/Loading";
import Head from "next/head";

interface Article {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  UserImage: string;
  UserName: string;
  slug: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleArticles, setVisibleArticles] = useState(10);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);

  // Static metadata for SEO
  const pageTitle = "Tech Blog | Latest Articles on Gadgets and Technology";
  const pageDescription =
    "Discover the latest tech reviews, comparisons and buying guides for laptops, mobiles and bikes.";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articals", {
          next: { revalidate: 10600 }, // ISR: Revalidate every hour
        });
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data.posts || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Memoized computations
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

  // Function to load more articles
  const loadMoreArticles = () => {
    const nextVisibleCount = visibleArticles + 8;
    if (nextVisibleCount >= filteredArticles.length) {
      setAllArticlesLoaded(true);
    }
    setVisibleArticles(nextVisibleCount);
  };

  // Reset visible articles and loaded state when filters change
  useEffect(() => {
    setVisibleArticles(16);
    setAllArticlesLoaded(false);
  }, [searchQuery, selectedCategory]);

  if (loading) return <Loading aria-live="polite" />;

  return (
    <>
      {/* SEO Optimized Head */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com/blog" />
      </Head>

      <main className="mt-10 p-6 md:p-10 dark:bg-zinc-800 bg-white min-h-screen">
        {/* Search with ARIA */}
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
            className="w-full px-5 py-3 dark:placeholder:fonts-date placeholder:fonts-date text-base border border-blue-300 rounded-full dark:placeholder:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 dark:bg-zinc-400 bg-white"
            aria-label="Search articles by title"
            aria-controls="articles-list"
          />
        </section>

        <div className="md:flex items-center justify-end hidden mb-4 mr-3">
          <strong className="text-xl dark:text-white text-gray-800">
            Total articles:{" "}
          </strong>
          <h1 className="text-md dark:text-white text-gray-900">
            {filteredArticles.length}
          </h1>
        </div>

        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl dark:text-white font-bold text-slate-800 tracking-tight">
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
              className="px-4 dark:bg-zinc-800 dark:text-white py-2 rounded-lg border border-blue-300 shadow-sm bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              aria-label="Filter articles by category"
            >
              {categories.map((category) => (
                <option
                  key={`cat-${category}`}
                  value={category === "All Categories" ? "" : category}
                  className="dark:bg-zinc-800"
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="flex md:hidden items-center justify-end">
              <strong className="text-sm dark:text-white  dark:bg-zinc-800 text-gray-800">
                Total articles:{" "}
              </strong>
              <h1 className="text-md dark:bg-zinc-800 dark:text-white text-gray-900">
                {filteredArticles.length}
              </h1>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" className="py-10 dark:text-white sr-only">
            Articles List
          </h2>
          <div
            id="articles-list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            role="list"
            aria-live="polite"
          >
            {filteredArticles.length > 0 ? (
              filteredArticles.slice(0, visibleArticles).map((article) => (
                <article
                  key={`article-${article._id}`}
                  className="bg-white dark:bg-zinc-700 rounded-xl break-inside-avoid border border-gray-200  shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1"
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-full object-cover rounded-md"
                    priority={false}
                    loading="lazy"
                    decoding="async"
                  />
                
                  <div className="p-5 gap-2 flex flex-col flex-1">
                    <h3
                      className="text-xl dark:text-white font-semibold text-gray-800"
                      itemProp="headline"
                    >
                      {article.title}
                    </h3>
                    <p
                      className="text-gray-600  dark:text-white  flex-1 text-sm leading-relaxed"
                      itemProp="description"
                    >
                      {article.description.split(" ").slice(0, 20).join(" ")}
                      {article.description.split(" ").length > 20 && "..."}
                    </p>
                   
                    <Link
                      href={`/article/${article.slug || article._id}`}
                      className="text-blue-600 hover:underline  dark:text-white dark:hover:underline underline-offset-4  hover:text-blue-800 font-medium transition-colors duration-200"
                      aria-label={`Read more about ${article.title}`}
                      itemProp="url"
                    >
                      Show More →
                    </Link>
                    <div className="flex justify-start items-center gap-3 mt-1">
                      {" "}
                      <Image
                        src={article.UserImage}
                        width={100}
                        height={100}
                        loading="lazy"
                        alt={article.title}
                        className="w-8 h-8 rounded-full"
                      />
                      <h1 className="text-sm  fonts-date ">
                        {article.UserName}
                      </h1>
                    </div>
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

        {/* Load More Button */}
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

        {/* All articles loaded message */}
        {allArticlesLoaded && (
          <div className="text-center mt-8 text-gray-500">
            You are reached the end of the list
          </div>
        )}
      </main>
    </>
  );
}
