"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { FaTrash, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { toast } from "sonner";

type MessageType = {
  _id: string;
  name: string;
  email: string;
  message: string;
  UserImage: string;
  date: string;
};

export default function MessagesPage() {
  const [data, setData] = useState<MessageType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages from the server
  useEffect(() => {
    const fetchMessages = async () => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const limit = 10;
        const res = await fetch(`/api/dashboard/getMessages?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch messages.");
        const newMessages: MessageType[] = await res.json();

        // Ensure no duplicate messages are added based on _id
        setData(prev => {
          const existingIds = new Set(prev.map(msg => msg._id));
          const uniqueMessages = newMessages.filter(msg => !existingIds.has(msg._id));
          return [...prev, ...uniqueMessages];
        });

        // Check if there are more messages to fetch
        setHasMore(newMessages.length === limit);
      } catch (error) {
        console.error(error);
        toast.error("Could not load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  },[hasMore, isLoading, page]);

  // Handle scroll event to trigger pagination
  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && !isLoading && hasMore) {
      setPage(prev => prev + 1); // Fetch the next page of messages
    }
  }, [isLoading, hasMore]);

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle message deletion
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/deleteMessage/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");
      setData(prev => prev.filter(msg => msg._id !== id));
      toast.success("Message deleted");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting message");
    }
  };

  // Format the date in a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-white">
          All Messages
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {data.length} message{data.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {data.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mb-4">
            <FaEnvelope className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No messages yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            All messages will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((msg) => (
            <div
              key={msg._id}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={msg.UserImage || "/default-avatar.png"}
                        alt={msg.name || "User"}
                        className="rounded-full w-12 h-12 object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {msg.name || "Anonymous"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <FaEnvelope className="mr-1.5 h-3.5 w-3.5" />
                        <span className="truncate">{msg.email}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition p-1"
                    title="Delete"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 pl-11">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-700 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt className="mr-1.5 h-3.5 w-3.5" />
                  <span>{formatDate(msg.date)}</span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Loading more messages...</p>
            </div>
          )}

          {!hasMore && data.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">All messages loaded</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
