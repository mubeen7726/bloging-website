import { NextResponse } from "next/server";
import connectDB from "@/lib/DBconnect";
import PostArtical from "@/models/PostArtical";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const imageFile = formData.get("image") as File | null;
    const imagePublicId = formData.get("imagePublicId")?.toString() || "";
    const content = formData.get("content")?.toString() || "";

    // Validate required fields
    if (!title || !description || !category||!content) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // Find blog post
    const existingBlog = await PostArtical.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    let newImageUrl: string = existingBlog.imageUrl;
    let newImagePublicId: string = existingBlog.imagePublicId;

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      try {
        // Delete old image
        if (existingBlog.imagePublicId) {
          await cloudinary.uploader.destroy(existingBlog.imagePublicId);
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const cloudinaryResult: UploadApiResponse = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "blog_posts",
              public_id: imagePublicId || undefined,
            },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });

        newImageUrl = cloudinaryResult.secure_url;
        newImagePublicId = cloudinaryResult.public_id;
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Update blog post
    const updatedBlog = await PostArtical.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        imageUrl: newImageUrl,
        imagePublicId: newImagePublicId,
        content,
        updatedAt: new Date(),
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
