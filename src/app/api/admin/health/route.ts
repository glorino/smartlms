import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can access health status" }, { status: 403 });
    }

    let dbResponseTime = 0;
    let dbStatus = "healthy";
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
      if (dbResponseTime > 200) dbStatus = "degraded";
    } catch {
      dbStatus = "down";
    }

    const now = Date.now();
    const oneDayAgo = new Date(now - 86400000);

    const [
      activeUsers,
      totalUsers,
      totalCourses,
      totalEnrollments,
      recentEnrollments,
      totalRevenue,
      recentRevenue,
      totalReviews,
      avgRating,
    ] = await Promise.all([
      prisma.user.count({ where: { updatedAt: { gte: new Date(now - 60 * 60 * 1000) } } }),
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { enrolledAt: { gte: oneDayAgo } } }),
      prisma.purchase.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }).then(r => r._sum.amount || 0),
      prisma.purchase.aggregate({ where: { status: "COMPLETED", createdAt: { gte: oneDayAgo } }, _sum: { amount: true } }).then(r => r._sum.amount || 0),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }).then(r => r._avg.rating || 0),
    ]);

    const appStart = (globalThis as any).__appStartTime || now;
    if (!(globalThis as any).__appStartTime) (globalThis as any).__appStartTime = now;
    const uptimeDays = Math.max(1, Math.floor((now - appStart) / 86400000));

    const dbStatusForService = dbStatus === "down" ? "down" : dbStatus === "degraded" ? "warning" : "healthy";

    return NextResponse.json({
      health: {
        databaseStatus: dbStatus,
        dbResponseTime,
        lastChecked: new Date().toISOString(),
        totalUsers,
        totalCourses,
        totalEnrollments,
        activeUsers,
        uptimeDays,
        services: [
          { name: "Database (PostgreSQL)", status: dbStatusForService, latency: `${dbResponseTime}ms` },
        ],
        totalRevenue,
        recentRevenue,
        recentEnrollments,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Health API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
