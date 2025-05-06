import { NextResponse } from "next/server";
import connectDB from "@/lib/DBconnect";
import PostArtical from "@/models/PostArtical";

// Define response type

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const posts = await PostArtical.find().sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return NextResponse.json({ status: 404 });
    }

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
