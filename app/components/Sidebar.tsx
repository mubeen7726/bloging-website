"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiUsers, FiMail } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineMenuOpen } from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";
import { TiPlus } from "react-icons/ti";
import { BsFillFileSpreadsheetFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <TbLayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "create Blog",
    href: "/dashboard/create-post",
    icon: <TiPlus className="w-5 h-5" />,
  },
  {
    name: "Blogs",
    href: "/dashboard/allBlogs",
    icon: <BsFillFileSpreadsheetFill className="w-5 h-5" />,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: <FiUsers className="w-5 h-5" />,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: <FiMail className="w-5 h-5" />,
  },
  {
    name: "Profile",
    href: "/dashboard/Profile",
    icon: <CgProfile className="w-5 h-5" />,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden   fixed top-0 left-0 right-0  flex items-center justify-between px-4 py-3 z-[-10px]">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 absolute top-30 left-0  bg-indigo-600 hover:bg-indigo-700"
        >
          <MdOutlineMenuOpen className="w-6 rotate-180 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white px-6 py-8 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:sticky md:top-0 md:h-screen`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between mb-10 md:mb-12">
          <Link href={"/dashboard"}>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </Link>

          <button
            className="md:hidden p-2 rounded-full bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsOpen(false)}
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-white/20 backdrop-blur-md"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="mr-3 ">{item.icon}</span>
              <span className="text-sm font-medium  fonts-normal">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed  inset-0 bg-black/50  md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Add top spacing for mobile */}
      <div className="md:hidden h-14" />
    </>
  );
}
