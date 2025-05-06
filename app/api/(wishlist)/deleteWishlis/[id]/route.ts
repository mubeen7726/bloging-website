// File: app/api/deleteWishlis/[id]/route.ts

import { wishlist } from "@/models/wishlist";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/DBconnect";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const blogId = url.pathname.split("/").pop();

    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const deletedItem = await wishlist.findByIdAndDelete(blogId);

    if (!deletedItem) {
      const checkId = await wishlist.findOneAndDelete({ blogId });
      if (!checkId) {
        return NextResponse.json({ message: "blog ID not found" });
      }
      return NextResponse.json(
        {
          success: true,
          message: "Item deleted successfully",
          data: deletedItem,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Item deleted successfully",
        data: deletedItem,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete wishlist item error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete wishlist item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
