import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Add your authentication logic here
  // For example, check for a session cookie or token
  // For now, we'll just redirect to /playground if trying to access /protected directly
  // TODO: Uncomment when we have authentication
  // if (request.nextUrl.pathname === "/protected") {
  //   return NextResponse.redirect(new URL("/playground", request.url));
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: "/protected",
};
