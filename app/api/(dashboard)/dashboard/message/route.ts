import Message from "@/models/message";
import connectDB from "@/lib/DBconnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message, email } = await request.json();

  try {
    await connectDB();
    const newMessage = new Message({ message, email });
    await newMessage.save();
    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
