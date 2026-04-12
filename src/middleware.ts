import { type NextRequest, NextResponse } from "next/server";
import { PROTECTED_PATHS } from "@/lib/protected-routes";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

function isProtectedPath(pathname: string): boolean {
  return (PROTECTED_PATHS as readonly string[]).some((p) => pathname === p);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (token && (await verifyAuthToken(token))) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run on all /work/* paths; the middleware function filters to protected ones only.
  matcher: ["/work/:path*"],
};
