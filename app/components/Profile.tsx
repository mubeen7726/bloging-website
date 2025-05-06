"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // shadcn/ui
import Loading from "./Loading";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO format
};

type ProfileProps = {
  value: UserProfile[] | null;
};

function Profile({ value }: ProfileProps) {
  if (!value) {
    return <Loading/>;
  }

  // Group by date and sort
  const userCountsByDate = value.reduce((acc: Record<string, number>, user) => {
    const date = user.createdAt.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(userCountsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className="w-full p-2  md:p-4 my-40 pb-40 shadow-md rounded-2xl bg-white dark:bg-gray-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl fonts-date font-semibold text-primary">
          Users Joined Per Day
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" className="text-sm fonts-date" />
            <YAxis allowDecimals={false} className="text-sm fonts-date" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, color: "#fff" }}
              labelStyle={{ color: "#fff" }}
              cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#6366f1", stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default Profile;
