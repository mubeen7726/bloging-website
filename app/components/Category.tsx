"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  {
    name: "Bike",
    image:
      "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746199613/Bloging%20website%20seperate%20image/zkwx6pkk5mhuqjx5vrnr.jpg",
    description: "Explore our wide range of bikes for every adventure.",
  },
  {
    name: "Laptop",
    image:
      "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746199611/Bloging%20website%20seperate%20image/bxwljyir9gfafg972cyc.jpg",
    description: "Find the perfect laptop for your work or gaming needs.",
  },
  {
    name: "Mobile",
    image:
      "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746199622/Bloging%20website%20seperate%20image/ykyc8irjzrz9q37rszg7.jpg",
    description: "Discover the latest mobile phones with cutting-edge features.",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Category() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col items-center justify-center my-10 bg-white dark:bg-zinc-800 rounded-lg p-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-800 fonts dark:text-white">
        Popular Categories
      </h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {categories.map((category) => (
          <motion.div
            key={category.name}
            className="flex flex-col items-center p-4 rounded-md transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </div>
            <h2 className="text-xl fonts font-semibold mb-2 text-gray-700 dark:text-gray-200">
              {category.name}
            </h2>
            <p className="text-gray-500 fonts-description dark:text-gray-400 text-center">
              {category.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Category;
