"use client";

import { useEffect, useState } from "react";
import { FaTrash, FaRegCopy, FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { UserType } from "@/types/User";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const USERS_PER_PAGE = 10;

export default function Page() {
  const [profiles, setProfiles] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch("/api/allProfile");
        if (!res.ok) throw new Error("Failed to fetch profiles");
        const data = await res.json();
        setProfiles(data.data);
      } catch (err) {
        console.error(err);
        toast.error("Error loading profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Calculate paginated users
  const paginatedUsers = () => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return profiles.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(profiles.length / USERS_PER_PAGE);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("User ID copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/deleteProfile/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("User deleted successfully");
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile._id !== id)
      );
    } catch (err) {
      toast.error("Error deleting user");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <Skeleton count={3} height={20} className="mb-4" />
              <div className="flex justify-center gap-6">
                <Skeleton width={24} height={24} circle />
                <Skeleton width={24} height={24} circle />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <FaUser className="h-12 w-12 mb-4 text-gray-300" />
        <h3 className="text-xl font-medium">No users found</h3>
        <p className="text-gray-400">There are currently no user profiles</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl dark:text-colors dark:text-[#FFFCF9] font-bold text-gray-800">
          User Profiles
        </h1>
        <p className="text-gray-500 dark:text-white mt-2">Manage all registered users</p>
      </div>

      <div className="flex justify-between items-center my-5">
        <div>
          <strong>Total Users:</strong>
          <span className="ml-3"> {profiles.length}</span>
        </div>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show first pages, current page, and last pages
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUsers().map((profile) => (
          <div
            key={profile._id}
            className="bg-white dark:bg-[#1B2432] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full mr-4">
                <Image
                  src={profile.image || "/default-avatar.png"}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-semibold dark:text-[#FFFCF9]  text-gray-800">
                  {profile.Username}
                </h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-[#F2E8CF]">User ID:</span>
                <span className="font-mono text-xs dark:text-[#F2E8CF] text-gray-700 truncate max-w-[120px]">
                  {profile._id}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-4 border-t pt-4">
              <button
                onClick={() => handleCopy(profile._id)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 rounded-md hover:bg-blue-50"
                title="Copy ID"
              >
                <FaRegCopy className="h-4 w-4" />
                <span className="text-sm">Copy</span>
              </button>
              <button
                onClick={() => handleDelete(profile._id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
                title="Delete User"
              >
                <FaTrash className="h-4 w-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
