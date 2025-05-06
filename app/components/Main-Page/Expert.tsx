"use client";
import { ArticlaType } from "@/types/ArticlaType";
import { LucideEarth } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Expert() {
  const [articles, setArticles] = useState<ArticlaType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/articals");
        const json = await response.json();
        setArticles(json?.posts);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      className="flex overflow-x-hidden overflow-y-hidden  flex-col lg:flex-row justify-between items-stretch w-full h-full rounded-lg shadow-md p-4 gap-4"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Left Column */}
      <div className="flex flex-col gap-4 w-full lg:w-1/2">
        {/* Card 1 */}
        <motion.div
          className="relative flex flex-col items-start justify-center gap-4 h-56 w-full rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Blurred background image */}
          <div
            className="absolute inset-0 z-0 scale-110 bg-cover bg-center bg-no-repeat filter brightness-75 blur-[4px]"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dktdpqfqk/image/upload/v1746198968/Bloging%20website%20seperate%20image/uwqhbmurbivqa0olrw9m.jpg')`,
            }}
          />
          <div className="relative z-10 ml-5 w-10 h-10 flex items-center justify-center rounded-md bg-transparent shadow-sm shadow-gray-500">
            <LucideEarth className="text-white" />
          </div>
          <div className="relative z-10 ml-5 text-white">
            <h1 className="text-2xl font-bold">
              Explore more to get your comfort zone
            </h1>
            <p>Book your perfect stay with us</p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="relative h-56 w-full bg-center bg-cover bg-no-repeat rounded-lg shadow-md overflow-hidden"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dktdpqfqk/image/upload/v1746198969/Bloging%20website%20seperate%20image/my7vrbv5zupu7gqzdk9q.jpg')`,
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-black/40 z-0 rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-5 text-white z-10">
            <h1 className="text-xl fonts font-semibold">Articles Available</h1>
            <h1 className="text-2xl font-bold fonts">
              {articles?.length || 0}
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Right Column */}
      <motion.div
        className="relative h-64 lg:h-auto w-full lg:w-1/2 bg-cover bg-no-repeat rounded-lg shadow-md overflow-hidden"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dktdpqfqk/image/upload/v1746198968/Bloging%20website%20seperate%20image/il9vsqohcnfso7xzz3xz.avif')`,
        }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/40 z-0 rounded-lg" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">
          <h1 className="text-3xl font-bold mb-2 fonts">Welcome to Our Blog</h1>
          <p className="text-lg max-w-md fonts">
            Discover stories, insights, and updates from across the globe. Stay
            informed, stay inspired.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Expert;
