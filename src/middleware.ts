import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { LEGACY_INTERNAL_PATH, PROTECTED_PATHS } from "@/lib/protected-routes";
import { type NextRequest, NextResponse } from "next/server";

function isProtectedPath(pathname: string): boolean {
  // All /internal/* routes are protected by prefix
  if (pathname.startsWith("/internal")) return true;
  // Legacy redirect path
  if (pathname === LEGACY_INTERNAL_PATH) return true;
  // Any /work/* slug ending in -internal is auto-protected (no manual list needed)
  if (/^\/work\/.+-internal$/.test(pathname)) return true;
  // Remaining explicitly listed slugs that don't follow the -internal convention
  return (PROTECTED_PATHS as readonly string[]).some((p) => pathname === p);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Redirect legacy /work/internal → /internal/work
  if (pathname === LEGACY_INTERNAL_PATH) {
    return NextResponse.redirect(new URL("/internal/work", request.url));
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
  matcher: ["/work/:path*", "/internal/:path*"],
};
