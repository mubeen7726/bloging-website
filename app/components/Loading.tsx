import React from "react";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-700 from-white to-gray-100">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
  );
}

export default Loading;
