import { NextResponse } from "next/server";
import connectDB from "@/lib/DBconnect";
import PostArtical from "@/models/PostArtical";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    const { live } = await request.json();

    // Find existing blog
    const existingBlog = await PostArtical.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Handle image upload if a new image is provided

    // Update blog in database
    const updatedBlog = await PostArtical.findByIdAndUpdate(
      id,
      {
        live: live,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
