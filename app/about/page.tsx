"use client";

import Head from "next/head";

import Image from "next/image";

import { FaPenFancy, FaUsers, FaRocket, FaHeart } from "react-icons/fa";

import { motion, useScroll, useTransform } from "framer-motion";

import React from "react";

// Team Members Data

const teamMembers = [
  {
    name: "Sarah Johnson",

    role: "Founder & Editor-in-Chief",

    bio: "Sarah started StoryVerse with a vision to create a platform where diverse voices could be heard. With a background in journalism, she curates our featured content.",

    image: "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746539473/Bloging%20website%20seperate%20image/mqyjol9on14lbtswyyy3.jpg",
  },

  {
    name: "Michael Chen",

    role: "Technical Director",

    bio: "Michael oversees all technical aspects of our platform, ensuring a seamless experience for both writers and readers.",

    image: "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746539479/Bloging%20website%20seperate%20image/nyhbl3d71mravr4wcnet.jpg",
  },

  {
    name: "Elena Rodriguez",

    role: "Community Manager",

    bio: "Elena fosters our growing community, organizing writing challenges and facilitating discussions among our members.",

    image: "https://res.cloudinary.com/dktdpqfqk/image/upload/v1746198969/Bloging%20website%20seperate%20image/my7vrbv5zupu7gqzdk9q.jpg",
  },
];

// Core Values Data

const values = [
  {
    title: "Authenticity",

    description:
      "We champion genuine storytelling and encourage writers to share their true voices and unique perspectives.",

    icon: "✍️",
  },

  {
    title: "Inclusivity",

    description:
      "Our platform is for everyone. We actively work to amplify underrepresented voices and create a welcoming space.",

    icon: "🌍",
  },

  {
    title: "Quality",

    description:
      "While we welcome writers of all levels, we maintain high standards for thoughtful, well-crafted content.",

    icon: "✨",
  },
];

// Fade-In Animation Variant

const fadeIn = (direction = "up", delay = 0) => {
  const variants = {
    hidden: {
      opacity: 0,

      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,

      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },

    visible: {
      opacity: 1,

      y: 0,

      x: 0,

      transition: {
        delay,

        duration: 0.7,

        ease: "easeOut",
      },
    },
  };

  return variants;
};

// Zoom-In Animation Variant

const zoomIn = {
  hidden: { scale: 0.8, opacity: 0 },

  visible: {
    scale: 1,

    opacity: 1,

    transition: {
      duration: 0.6,

      ease: "easeOut",
    },
  },
};

// Flip Animation Variant

const flip = {
  hidden: { rotateY: 0 },

  visible: {
    rotateY: 180,

    transition: {
      duration: 0.5,
    },
  },
};

export default function AboutPage() {
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <>
      <Head>
        <title>About Our Blog | StoryVerse</title>

        <meta
          name="description"
          content="Learn about our mission, team, and the story behind our blogging platform"
        />
      </Head>

      {/* Hero Section */}

      <section className="relative bg-gradient-to-b from-teal-600 to-teal-300 dark:from-gray-900 dark:to-gray-800 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-30 dark:opacity-60 z-0" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn("up", 0)}
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
        >
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Our Story, Your Voice
          </h1>

          <p className="text-xl md:text-2xl font-light opacity-90">
            Empowering writers and readers to connect through authentic
            storytelling
          </p>
        </motion.div>
      </section>

      {/* Main Content */}

      <motion.div
        className="container mx-auto px-6 py-24 space-y-24"
        style={{ scale }}
      >
        {/* Mission Section */}

        <motion.div
          variants={fadeIn("up", 0.2)}
          className="flex flex-col lg:flex-row items-center gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              Our Mission
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-lg">
              At StoryVerse, we believe everyone has a story worth sharing. We
              strive to amplify voices across the globe.
            </p>

            <p className="text-gray-600 dark:text-gray-300 text-lg">
              We are committed to maintaining an inclusive space for all
              storytellers to thrive.
            </p>
          </div>

          <motion.div
            className="relative h-96 w-full lg:w-1/2 rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://res.cloudinary.com/dktdpqfqk/image/upload/v1746539279/Bloging%20website%20seperate%20image/ip4qp1aistlg4u395zpv.jpg"
              alt="Mission visual"
              fill
              className="object-cover"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Stats Section */}

        <motion.div
          variants={zoomIn}
          className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: <FaPenFancy />,
              title: "10,000+",
              text: "Articles Published",
            },

            { icon: <FaUsers />, title: "5,000+", text: "Active Writers" },

            { icon: <FaRocket />, title: "2018", text: "Founded In" },

            { icon: <FaHeart />, title: "100%", text: "Passion-Driven" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="space-y-3 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-indigo-600 dark:text-indigo-400 text-4xl flex justify-center">
                {stat.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {stat.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">{stat.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Section */}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", index * 0.15)}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {member.name}
                </h3>

                <p className="text-indigo-600 dark:text-indigo-400 mb-3">
                  {member.role}
                </p>

                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values Section */}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={flip}
              whileHover="visible"
              initial="hidden"
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="text-indigo-600 dark:text-indigo-400 text-4xl mb-4">
                {value.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {value.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}

        <motion.div
          variants={fadeIn("up", 0.3)}
          className="bg-gradient-to-r max-sm:mb-30 from-teal-600 to-teal-300 dark:from-gray-900 dark:to-gray-800 text-white rounded-3xl p-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Share Your Story?
          </h2>

          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            Join our community of passionate writers and readers today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-teal-600 font-bold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Start Writing
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="border-2 border-white hover:border-teal-100 text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-lg transition"
            >
              Explore Articles
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
