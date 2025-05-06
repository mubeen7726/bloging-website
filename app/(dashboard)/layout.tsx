"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("User");
    if (!userData) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen "></div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto hiddenScrol">{children}</main>
    </div>
  );
}
