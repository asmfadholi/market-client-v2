import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME || "";
  const isAuthenticated = req.cookies.get(cookieName);

  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const loginPage = pathname === "/login";

  if (loginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
