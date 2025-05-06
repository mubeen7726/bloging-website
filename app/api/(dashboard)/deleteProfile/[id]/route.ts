import { User } from "@/models/Users";
import connectDB from "@/lib/DBconnect";
import { NextResponse } from "next/server";

// This handler works with dynamic route param: [id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await connectDB();

    const deletedProfile = await User.findByIdAndDelete(id);
    if (!deletedProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete user:", err); // log to fix ESLint warning
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
