import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "biomed_admin_session";
const DEV_COOKIE_NAME = "biomed_dev_session";
async function isTokenValid(token: string): Promise<boolean> {
  try {
    const secret =
      process.env.AUTH_SECRET ||
      (process.env.NODE_ENV !== "production"
        ? "dev-only-secret-key-at-least-32-chars-long"
        : "");
    if (!secret) return false;
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return Boolean(payload && payload.role === "admin");
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const devCookie = request.cookies.get(DEV_COOKIE_NAME);

  let isAuthenticated = false;
  if (sessionCookie?.value) {
    isAuthenticated = await isTokenValid(sessionCookie.value);
  } else if (devCookie?.value) {
    try {
      const parsed = JSON.parse(devCookie.value);
      isAuthenticated = Boolean(parsed && parsed.role === "admin");
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Guard protected admin pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect authenticated users away from /admin/login
  if (pathname === "/admin/login" && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Response with security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images/|api/auth/login).*)",
  ],
};
