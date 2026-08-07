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
];
const publicApiRoutes = [
  { path: /^\/api\/courses$/, method: "GET" },
  { path: /^\/api\/courses\/[^/]+$/, method: "GET" },
  { path: /^\/api\/auth\//, method: "ALL" },
  { path: /^\/api\/chat$/, method: "ALL" },
  { path: /^\/api\/reviews$/, method: "GET" },
  { path: /^\/api\/quizzes$/, method: "GET" },
];
const publicPageRoutes = [
  /^\/certificate\/[^/]+$/,
  /^\/verify-certificate$/,
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

  if (pathname === "/api/courses" && method === "POST") {
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  if (pathname === "/api/enrollments" && method === "POST") {
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  if (pathname === "/api/notifications" && method === "POST") {
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
