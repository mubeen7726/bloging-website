'use client'

import { motion } from 'framer-motion'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] })

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function PrivacyPolicyPage() {
  return (
    <motion.div
      className={`min-h-screen px-4 sm:px-8 py-16 bg-gradient-to-br from-teal-50 to-white flex justify-center ${inter.className}`}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
    >
      <motion.section
        className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8 sm:p-12 border border-teal-100"
        variants={fadeUp}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-teal-600 mb-6 tracking-tight"
          variants={fadeUp}
        >
          Privacy Policy
        </motion.h1>

        <motion.p className="text-gray-700 mb-4 leading-relaxed" variants={fadeUp}>
          Your privacy is important to us. This Privacy Policy describes how we collect, use, and protect your personal information when you use our blog.
        </motion.p>

        <motion.h2 className="text-2xl font-semibold text-teal-500 mt-8 mb-3" variants={fadeUp}>
          1. Information We Collect
        </motion.h2>
        <motion.ul className="list-disc pl-6 text-gray-700 space-y-1" variants={fadeUp}>
          <li>Your name and email when signing up or commenting</li>
          <li>Browser and device information</li>
          <li>Cookies and usage data</li>
        </motion.ul>

        <motion.h2 className="text-2xl font-semibold text-teal-500 mt-8 mb-3" variants={fadeUp}>
          2. How We Use Information
        </motion.h2>
        <motion.p className="text-gray-700 mb-4 leading-relaxed" variants={fadeUp}>
          We use your data to enhance your experience, improve our content, and communicate important updates.
        </motion.p>

        <motion.h2 className="text-2xl font-semibold text-teal-500 mt-8 mb-3" variants={fadeUp}>
          3. Your Rights
        </motion.h2>
        <motion.ul className="list-disc pl-6 text-gray-700 space-y-1" variants={fadeUp}>
          <li>Request access or deletion of your data</li>
          <li>Withdraw consent anytime</li>
          <li>Contact us for data concerns</li>
        </motion.ul>

        <motion.h2 className="text-2xl font-semibold text-teal-500 mt-8 mb-3" variants={fadeUp}>
          4. Data Security
        </motion.h2>
        <motion.p className="text-gray-700 mb-4 leading-relaxed" variants={fadeUp}>
          We implement modern security measures to safeguard your data against unauthorized access and disclosure.
        </motion.p>

        <motion.h2 className="text-2xl font-semibold text-teal-500 mt-8 mb-3" variants={fadeUp}>
          5. Contact Us
        </motion.h2>
        <motion.p className="text-gray-700 leading-relaxed" variants={fadeUp}>
          If you have questions about our Privacy Policy, email us at <strong>Social-Hub.com</strong>.
        </motion.p>
      </motion.section>
    </motion.div>
  )
}
