import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

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
  "/maintenance",
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
  { path: /^\/api\/payments\/webhook$/, method: "POST" },
];

export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Maintenance mode: block non-admins (admins keep access so they can turn it off).
  const maintenanceExempt =
    pathname === "/maintenance" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/payments/webhook");
  if (!maintenanceExempt) {
    try {
      const settings = await getSettings();
      if (settings.maintenanceMode) {
        const role = (req.auth?.user as any)?.role;
        if (role !== "ADMIN") {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { error: "Platform is under maintenance" },
              { status: 503 }
            );
          }
          return NextResponse.redirect(
            new URL("/maintenance", req.nextUrl.origin)
          );
        }
      }
    } catch {
      // Fail open: never block the app because settings could not be read.
    }
  }

  if (publicRoutes.includes(pathname)) return NextResponse.next();

  for (const route of publicPageRoutes) {
    if (route.test(pathname)) return NextResponse.next();
  }

  for (const route of publicApiRoutes) {
    if (route.path.test(pathname)) {
      if (route.method === "ALL" || route.method === method) return NextResponse.next();
    }
  }

  // Block all access for blocked users
  if (req.auth && (req.auth.user as any)?.isBlocked) {
    return NextResponse.redirect(new URL("/login?blocked=true", req.nextUrl.origin));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/instructor")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
    const role = (req.auth.user as any)?.role;
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    if (pathname.startsWith("/instructor") && role !== "INSTRUCTOR" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  const mutatingMethods = ["POST", "PUT", "DELETE", "PATCH"];
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
  // Prisma (used for the maintenance-mode settings lookup) needs the Node runtime.
  runtime: "nodejs",
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
