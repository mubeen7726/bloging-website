import { NextResponse, NextRequest } from "next/server";
import { SingleImageUpload } from "@/lib/SingleImageUpload";

// Increase the body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "400mb", // Set to match your max file size
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      const MAX_IMAGE_FILE_SIZE = 20 * 1024 * 1024; // 20MB

      if (imageFile.size > MAX_IMAGE_FILE_SIZE) {
        return NextResponse.json(
          { error: "Image file size too large. Maximum size is 20MB." },
          { status: 400 }
        );
      }

      const result = await SingleImageUpload(imageFile, "blog-images");

      console.log("Image upload result:", result.secure_url);

      return NextResponse.json(
        {
          success: true,
          type: "image",
          data: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
