import { User } from "@/models/Users";
import connectDB from "@/lib/DBconnect";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  await connectDB();
  try {
    const { email } = await req.json();

    const data = await User.findOne({ email: email });

    if (!data) {
      return NextResponse.json(
        { message: "Email not found", data: null },
        { status: 404 }
      );
    }

    // Create a response with the JSON data
    const response = NextResponse.json(
      { message: "User found", data: data },
      { status: 200 }
    );

    // Set cookie with user data
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
      sameSite: "strict" as const,
    };

    response.cookies.set("UserData", JSON.stringify(data), cookieOptions);

    return response;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
