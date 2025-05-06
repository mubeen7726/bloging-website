// app/api/chekBlogpage/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/DBconnect";
import { wishlist } from "@/models/wishlist";

export async function POST(req: NextRequest) {
  try {
    const { id, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    await connectDB();

    const exists = await wishlist.findOne({ blogId: id, userId });
    if (!exists) {
      return NextResponse.json({ status: 300 });
    } else {
      return NextResponse.json({ status: 600, data: exists });
    }
  } catch (err) {
    console.error("Error in chekBlogpage route:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
