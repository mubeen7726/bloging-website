// app/api/wishlist/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectDB from "@/lib/DBconnect";
import { wishlist } from "@/models/wishlist";
import { wishlistType } from "@/types/wishlistType";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body: wishlistType = await req.json();
    const { userId, blogId, image, title } = body;

    if (!userId || !blogId || !image || !title) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional: check if already in wishlist
    const existing = await wishlist.findOne({ userId, blogId });
    if (existing) {
      return NextResponse.json(
        { message: "Already in wishlist" },
        { status: 409 }
      );
    }

    const newWish = new wishlist({ userId, blogId, image, title });
    await newWish.save();

    return NextResponse.json(
      { message: "Added to wishlist", data: newWish },
      { status: 201 }
    );
  } catch (error) {
    console.error("wishlist route error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
