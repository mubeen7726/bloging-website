import { wishlist } from "@/models/wishlist";
import connectDB from "@/lib/DBconnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const data = await wishlist.find({ userId });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get wishlist" },
      { status: 500 }
    );
  }
}
