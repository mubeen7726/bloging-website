import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Signed out" });
  response.cookies.set("UserData", "", {
    path: "/",
    expires: new Date(0), // Expire it
  });
  return response;
}
