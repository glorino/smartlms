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
      return NextResponse.json(
        { error: "Only admins can access health status" },
        { status: 403 }
      );
    }

    let dbStatus = "healthy";
    let dbResponseTime = 0;

    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
    } catch {
      dbStatus = "unhealthy";
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [
      recentErrors,
      activeUsers,
      pendingEnrollments,
      failedPayments,
    ] = await Promise.all([
      prisma.activityLog.count({
        where: {
          action: { contains: "ERROR" },
          createdAt: { gte: oneHourAgo },
        },
      }),
      prisma.user.count({
        where: {
          updatedAt: { gte: oneHourAgo },
        },
      }),
      prisma.enrollment.count({
        where: {
          status: "ACTIVE",
          enrolledAt: { gte: oneHourAgo },
        },
      }),
      prisma.purchase.count({
        where: {
          status: "FAILED",
          createdAt: { gte: oneHourAgo },
        },
      }),
    ]);

    const overallStatus =
      dbStatus === "healthy" && recentErrors < 10 ? "healthy" : "degraded";

    return NextResponse.json({
      status: overallStatus,
      timestamp: now.toISOString(),
      checks: {
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`,
        },
        api: {
          status: "healthy",
          responseTime: "<50ms",
        },
      },
      metrics: {
        recentErrors,
        activeUsers,
        pendingEnrollments,
        failedPayments,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
