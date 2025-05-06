"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks";
import { setUserProfile } from "@/features/user/userSlice";
import { UserProfileData } from "@/types/userType";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import navbarModule from '@/style/navbar.module.css'

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
  }
  interface Session {
    user?: User & { isAdmin?: boolean };
  }
}

// signout data form browser

const out = async () => {
  await signOut();
  localStorage.clear();
  await fetch("/api/signout");
};

// Dynamic Icons
const FcGoogle = dynamic(
  () => import("react-icons/fc").then((mod) => mod.FcGoogle),
  { ssr: false }
);
const HiMenu = dynamic(
  () => import("react-icons/hi").then((mod) => mod.HiMenu),
  { ssr: false }
);
const IoClose = dynamic(
  () => import("react-icons/io5").then((mod) => mod.IoClose),
  { ssr: false }
);

export default function Navbar() {
  const { setTheme } = useTheme();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<UserProfileData>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // Auto-popup on load
  useEffect(() => {
    const timer1 = setTimeout(() => setShowAuthPopup(true), 5000); // show after 1s
    const timer2 = setTimeout(() => setShowAuthPopup(false), 10000); // close after 5s more

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();
      if (!data) return;

      localStorage.setItem("User", JSON.stringify(data.data));
      dispatch(setUserProfile(data));
    } catch (err) {
      console.log("Fetch profile error:", err);
    }
  }, [session?.user?.email, dispatch]);

  useEffect(() => {
    if (session?.user?.email) fetchProfile();
  }, [session, fetchProfile]);

  useEffect(() => {
    const local = localStorage.getItem("User");
    if (local) setUser(JSON.parse(local));
  }, []);

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/all-blogs" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Wishlist", href: "/wishlist" },
    ...(user?.isAdmin ? [{ title: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="w-full dark:bg-zinc-700 relative z-50 top-0 min-h-[5vh] lg:min-h-[13vh] bg-teal-50 backdrop-blur-xm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-center">
         {/* Logo */}
         <Link
            href="/"
            className=" flex items-center justify-center font-bold text-teal-500 hover:text-shadow-teal-600 text-shadow-md transition-all"
          >
            <Image
              src={"https://res.cloudinary.com/dktdpqfqk/image/upload/v1746537279/Bloging%20website%20seperate%20image/rhtnp9g482vzt6qpnv4y.png"}
              width={100}
              height={100}
              loading="lazy"
                className={`${navbarModule.logo}`}
              alt="logo not found"
            ></Image>
          </Link>
          </div>
 

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`text-md ${navbarModule.link}  hover:text-shadow-sm  text-shadow-[#a1e8e2]  dark:hover:text-shadow-none max-sm:w-[8vh] max-sm:h-[8vh] font-semibold`}
                >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {status === "loading" ? (
              <div className="animate-pulse h-8 w-8 bg-gray-600 rounded-full" />
            ) : session ? (
              <div className="relative py-5 group">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                />
                <div className="absolute right-0 mt-2 w-48 hidden group-hover:flex flex-col bg-[#1a1a1a] rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-300">
                    {session.user?.name}
                  </div>
                  <button
                    onClick={out}
                    className="text-left px-4 py-2 text-sm text-gray-300 hover:bg-teal-600/20"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthPopup(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              <HiMenu className="h-6 w-6 text-teal-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-[#1a1a1a] shadow-lg transition-all duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-teal-400"
            >
              <IoClose className="h-6 w-6" />
            </button>

            <div className="mt-8 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`${navbarModule.mobileLink}`}

                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              {/* Theme Toggle */}
              <div className="flex justify-start">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
                      <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Auth */}
              {session ? (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={session.user?.image || "/default-avatar.png"}
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-gray-300">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={out}
                    className="w-full text-left text-gray-300 hover:text-teal-400"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthPopup(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      <AnimatePresence>
        {!session && showAuthPopup && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              bounce: 0.4,
            }}
            className="fixed inset-0 flex items-start justify-end p-5 z-50"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white dark:bg-zinc-700 w-full max-w-sm p-6 rounded-xl shadow-2xl text-center relative"
            >
              <motion.button
                onClick={() => setShowAuthPopup(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <IoClose className="h-6 w-6" />
              </motion.button>
              <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
                Welcome Back
              </h2>
              <p className="text-gray-400 mb-6">
                Sign in to continue to your account
              </p>
              <motion.button
                whileHover={{ scale: 1.1, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 0 }}
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-all duration-300"
              >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
