// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import connectDB from "@/lib/DBconnect";
import Post from "@/models/PostArtical";
import { UserType } from "@/types/User";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

// Convert buffer to readable stream
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// Response Type
interface PostResponse {
  message?: string;
  error?: string;
  post?: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    UserImage: string;
    UserName: string;
    imageUrl: string;
    imagePublicId: string;
  };
}

// POST handler
export async function POST(req: Request): Promise<NextResponse<PostResponse>> {
  try {
    await connectDB();

    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();

    const file = formData.get("coverImage") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const content = formData.get("content") as string | null;

    const userString = formData.get("user") as string | null;
    const user: UserType | null = userString ? JSON.parse(userString) : null;

    if (!file || !title || !description || !category || !content || !user) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size should be less than 20MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blog_posts",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation: [
            { width: 1200, height: 630, crop: "fill" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            return reject(new Error("Cloudinary upload failed"));
          }
          resolve(result);
        }
      );
      bufferToStream(buffer).pipe(uploadStream);
    });

    const newPost = await Post.create({
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      UserImage: user.image,
      UserName: user.Username,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
      category: category.toLowerCase().trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: {
          id: newPost._id.toString(),
          title: newPost.title,
          description: newPost.description,
          content: newPost.content,
          category: newPost.category,
          UserImage: newPost.UserImage,
          UserName: newPost.UserName,
          imageUrl: newPost.imageUrl,
          imagePublicId: newPost.imagePublicId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
