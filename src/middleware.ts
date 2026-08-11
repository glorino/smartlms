import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicRoutes = [
  "/",
  "/courses",
  "/login",
  "/register",
  "/pricing",
  "/about",
  "/live-classes",
  "/forgot-password",
  "/reset-password",
  "/become-instructor",
  "/blog",
  "/careers",
  "/community",
  "/docs",
  "/enterprise",
  "/help",
  "/privacy",
  "/support",
  "/terms",
  "/demo",
  "/payment/success",
  "/payment/failed",
  "/contact",
];
const publicPageRoutes = [
  /^\/certificate\/[^/]+$/,
  /^\/verify-certificate$/,
  /^\/courses\/[^/]+$/,
  /^\/courses\/[^/]+\/learn$/,
  /^\/quiz\/[^/]+$/,
];
const publicApiRoutes = [
  { path: /^\/api\/courses$/, method: "GET" },
  { path: /^\/api\/courses\/[^/]+$/, method: "GET" },
  { path: /^\/api\/auth\//, method: "ALL" },
  { path: /^\/api\/chat$/, method: "ALL" },
  { path: /^\/api\/reviews$/, method: "GET" },
  { path: /^\/api\/quizzes$/, method: "GET" },
  { path: /^\/api\/quizzes\/[^/]+$/, method: "GET" },
  { path: /^\/api\/live-classes$/, method: "GET" },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (publicRoutes.includes(pathname)) return NextResponse.next();

  for (const route of publicPageRoutes) {
    if (route.test(pathname)) return NextResponse.next();
  }

  for (const route of publicApiRoutes) {
    if (route.path.test(pathname)) {
      if (route.method === "ALL" || route.method === method) return NextResponse.next();
    }
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/instructor")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  const mutatingMethods = ["POST", "PUT", "DELETE"];
  if (mutatingMethods.includes(method)) {
    const protectedPaths = [
      /^\/api\/reviews$/,
      /^\/api\/notes$/,
      /^\/api\/notes\/[^/]+$/,
      /^\/api\/messages$/,
      /^\/api\/quizzes$/,
      /^\/api\/quizzes\/[^/]+$/,
      /^\/api\/grades$/,
      /^\/api\/assignments$/,
      /^\/api\/progress$/,
      /^\/api\/live-classes$/,
      /^\/api\/live-classes\/[^/]+$/,
      /^\/api\/courses$/,
      /^\/api\/enrollments$/,
      /^\/api\/notifications$/,
    ];
    for (const pattern of protectedPaths) {
      if (pattern.test(pathname)) {
        if (!req.auth) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        break;
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
