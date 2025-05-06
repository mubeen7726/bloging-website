import { User } from "@/models/Users";
import connectDB from "@/lib/DBconnect";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const data = await User.find({});

    if (!data) {
      return NextResponse.json(
        { message: "Email not found", data: null },
        { status: 404 }
      );
    }
    if (data.length === 0) {
      return NextResponse.json({ message: "0" });
    }

    // Create a response with the JSON data
    const response = NextResponse.json({ data: data }, { status: 200 });

    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
