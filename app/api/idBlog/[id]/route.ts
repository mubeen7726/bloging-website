import { NextResponse } from "next/server";
import PostArtical from "@/models/PostArtical";
import connectDB from "@/lib/DBconnect";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } } // ✅ Correct typing
) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Post ID" },
        { status: 400 }
      );
    }

    const post = await PostArtical.findById(id).lean();

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}