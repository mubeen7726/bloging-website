"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "motion/react";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface ApiResponse {
  posts: BlogPost[];
  error?: string;
}

const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full animate-pulse">
      <div className="aspect-video bg-gray-100"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-100 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-4/6"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-4 bg-gray-100 rounded w-24"></div>
          <div className="h-8 bg-gray-100 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
});
SkeletonCard.displayName = "SkeletonCard";

const BlogCard = React.memo(function BlogCard({ blog }: { blog: BlogPost }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="bg-white   dark:bg-zinc-700 rounded-xl shadow-md overflow-hidden md:max-h-120 transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video flex">
        <div className="z-10 px-3 py-1 text-xs sm:text-sm rounded-full bg-gradient-to-r to-blue-500 from-pink-500 text-white font-medium absolute top-3 left-3">
          {blog.category}
        </div>
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />
      </div>
      <div className="px-6  pt-6 flex flex-col">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 line-clamp-2 dark:text-white text-gray-900">
          {blog.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-white mb-4 line-clamp-3 flex-grow">
          {blog.description}
        </p>
        <div className="flex justify-between items-center mt-auto mb-10">
          <time
            dateTime={new Date(blog.createdAt).toISOString()}
            className="text-sm fonts-date dark:text-[#ffff] text-gray-500"
          >
            {formatDate(blog.createdAt)}
          </time>
          <Link
            href={`/article/${blog._id}`}
            className="text-sm sm:text-base px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label={`Read more about ${blog.title}`}
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
});
BlogCard.displayName = "BlogCard";

const LatestNews = React.memo(function LatestNews() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch("/api/getLatest");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: ApiResponse = await response.json();
      setBlogs(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white text-gray-900">
            Latest News
          </h2>
          <div className="h-8 w-24 bg-gray-100 rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Content</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Retry loading news"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <div className="flex  md:flex-row md:justify-between md:items-center mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-[#ffff]">
            Latest Article
          </h2>
          <Link
            href="/all-blogs"
            className="text-lg sm:text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors underline underline-offset-4 focus:outline-none"
            aria-label="View all blog posts"
          >
            View all articles
          </Link>
        </div>
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Blog Not Found</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Retry loading news"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
      <div className="flex  md:flex-row justify-between md:items-center mb-10 gap-4">
        <h2 className="max-md:text-lg md:2xl lg:text-4xl font-bold dark:text-white text-gray-900">
          Latest Article
        </h2>
        <Link
          href="/all-blogs"
          className="text-lg md:text-xl font-medium dark:text-[#ffff] text-blue-600 hover:text-blue-800 transition-colors underline underline-offset-4 focus:outline-none"
          aria-label="View all blog posts"
        >
          View all articles
        </Link>
      </div>

      <div className="relative group">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".blog-swiper-next",
            prevEl: ".blog-swiper-prev",
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-12"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id} className="h-auto">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ amount: 0.2 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className="blog-swiper-prev absolute md:left-0 max-md:left-[-1rem] top-1/2 -translate-y-1/2 z-10 md:p-3 rounded-full shadow-lg cursor-pointer md:w-12 md:h-12 max-md:p-1 flex items-center justify-center bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700">
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className="blog-swiper-next absolute md:right-0 max-md:right-[-1rem] top-1/2 -translate-y-1/2 z-10 md:p-3 rounded-full shadow-lg cursor-pointer md:w-12 max-md:p-1 md:h-12 flex items-center justify-center bg-gray-50 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700">
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </section>
  );
});
LatestNews.displayName = "LatestNews";

export default LatestNews;
