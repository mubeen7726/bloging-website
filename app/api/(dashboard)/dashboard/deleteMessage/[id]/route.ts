import Messages from "@/models/message";
import connectDB from "@/lib/DBconnect";
import { NextResponse } from "next/server";

export async function DELETE(  request: Request,
  { params }: { params: { id: string } }) {
    const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
  }

  try {
    await connectDB();

    const deleted = await Messages.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
