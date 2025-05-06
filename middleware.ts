import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('UserData')?.value;
  
  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie);
      
      if (userData?.isAdmin === false) {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  return NextResponse.next();
}
export const config = {
    matcher: '/dashboard/:path*',
  }