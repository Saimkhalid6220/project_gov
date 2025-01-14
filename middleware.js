import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {

    if (
      req.nextUrl.pathname.startsWith("/createUser") &&
      !req.nextauth.token.role
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    else if (
      req.nextUrl.pathname.startsWith("/manageUser") &&
      !req.nextauth.token.role
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    else if (
      req.nextUrl.pathname.startsWith("/")
    ) {
      return NextResponse.rewrite(new URL("/Login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/createUser","/manageUser","/"] };