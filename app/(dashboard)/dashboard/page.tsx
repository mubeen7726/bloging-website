"use client";
import React from "react";
import { useEffect, useState } from "react";
import Profile from "@/app/components/Profile";

function Page() {
  const [articles, setArticles] = useState([]);
  const [profile, setProfile] = useState (null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch("/api/dashboard/onlyDashboard_article", {
          next: { revalidate: 10600 }, // ISR: Revalidate every hour
        });
        if (!articlesRes.ok) throw new Error("Failed to fetch articles");
        const articlesData = await articlesRes.json();
        setArticles(articlesData.posts || []);
        // Fetch profile
        const profileRes = await fetch("/api/allProfile");
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();
        setProfile(profileData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
   <div className="text-center mb-8 mt-8  dark:bg-zinc-800 dark:text-white">
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 fonts ">Admin Dashboard</h1>
          <p className="mt-2 text-lg dark:text-white text-gray-600">
            View and manage your account information
          </p>
        </div>
    <div className="flex max-h-30  max-md:my-10 items-start mt-10 mx-10 justify-around dark:bg-zinc-800  h-screen bg-white">
   
      <div className="bg-gradient-to-b px-10 dark:shadow-lg dark:shadow-gray-600 md:px-20 from-green-500 to-green-300 p-6 rounded-lg shadow-lg text-center ">
        <h1 className="text-2xl font-bold mb-4 text-accent dark:text-white fonts-description">Total Users</h1>
        {profile && (
          <p className="text-white ">
            <span className="text-xl fonts-date font-bold text-white">
              {Object.keys(profile).length}
            </span>
          </p>
        )}
      </div>
      <div className="bg-gradient-to-b px-10 md:px-20 dark:shadow-lg dark:shadow-gray-600 from-blue-500 to-blue-300 p-6 rounded-lg shadow-lg text-center ml-4">
        <h1 className="text-2xl font-bold mb-4 text-accent dark:text-white fonts-description">Total Articles</h1>

        <p className="text-white ">
          <span className="text-xl fonts-date font-bold text-white">
            {articles.length}
          </span>
        </p>
      </div>
    </div>
    <Profile value={profile} />

    </>
  );
}

export default Page;
