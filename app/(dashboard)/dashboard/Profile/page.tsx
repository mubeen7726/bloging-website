"use client";

import  { useEffect, useState } from "react";
import { UserProfileData } from "@/types/userType";
import { FiUser, FiMail, FiShield, FiCalendar } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner";
import Image from "next/image";
import Loading from "@/app/components/Loading";
import { useAppSelector } from "@/lib/hooks";



const ProfilePage = () => {

  const [userProfile,SetUserProfile]=useState<UserProfileData>();


    const user = useAppSelector((state)=>state.user.profile);
    console.log("user data for redux", user) 



// get the data from localStorage for user
  useEffect(() => {
    const data = localStorage.getItem("User");
    if(!data){
      console.error("User data not found in localStorage");
      return;
    }
    if (data) {
      const json = JSON.parse(data);
      SetUserProfile(json);
    } else {
      console.error("Token not define");
    }
  }, []);




  // State to hold formatted dates to prevent SSR/client mismatch
  const [formattedDates, setFormattedDates] = useState({
    createdAt: "N/A",
    updatedAt: "N/A",
  });

  useEffect(() => {
    const formatDate = (dateString?: string) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    if (userProfile) {
      setFormattedDates({
        createdAt: formatDate(userProfile.createdAt),
        updatedAt: formatDate(userProfile.updatedAt),
      });
    }
  }, [userProfile]);

  // copy user id function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Copy failed:", err);
    }
  };

 
  // loading
    if (!userProfile) {
      return (
  <Loading/>
      );
    }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage your account information
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0 h-24 w-24 rounded-full bg-white p-1 shadow-md">
                <Image
                  className="h-full w-full rounded-full object-cover"
                  src={userProfile.image || "/default-avatar.png"}
                  alt="User profile"
                  width={96}
                  height={96}
                  priority
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {userProfile.Username || "Anonymous User"}
                </h2>
                <p className="mt-1 text-blue-100">
                  Member since {formattedDates.createdAt}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-500">
                <FiUser className="mr-2 flex-shrink-0" />
                <span className="font-medium">User ID</span>
              </div>
              <div className="md:col-span-2 flex items-center justify-between">
                <span className="font-mono text-sm text-gray-800 truncate">
                  {userProfile._id}
                </span>
                <button
                  onClick={() => copyToClipboard(userProfile._id)}
                  className="ml-2 text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Copy user ID"
                >
                  <MdContentCopy size={18} />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-500">
                <FiMail className="mr-2 flex-shrink-0" />
                <span className="font-medium">Email address</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-800">{userProfile.email}</span>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-500">
                <FiShield className="mr-2 flex-shrink-0" />
                <span className="font-medium">Account Type</span>
              </div>
              <div className="md:col-span-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userProfile.isAdmin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {userProfile.isAdmin ? "Administrator" : "Standard User"}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-500">
                <FiCalendar className="mr-2 flex-shrink-0" />
                <span className="font-medium">Last Updated</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-800">{formattedDates.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;