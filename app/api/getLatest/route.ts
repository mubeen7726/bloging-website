import { NextResponse } from "next/server";
import connectDB from "@/lib/DBconnect";
import PostArtical from "@/models/PostArtical";
import { ArticlaType } from "@/types/ArticlaType";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    // Get latest 6 posts, sorted by creation date
    const posts = await PostArtical.find({live:true})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean<ArticlaType[]>();

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
