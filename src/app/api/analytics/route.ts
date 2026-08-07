import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = session.user.id;
    const isInstructor = userRole === "INSTRUCTOR";
    const isAdmin = userRole === "ADMIN";

    if (!isInstructor && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    const daysMap: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    const days = daysMap[range] || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const prevSinceDate = new Date(sinceDate);
    prevSinceDate.setDate(prevSinceDate.getDate() - days);

    const courseFilter = isInstructor
      ? { instructorId: userId }
      : {};

    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    const totalCourses = await prisma.course.count({
      where: courseFilter,
    });

    const totalRevenueResult = await prisma.purchase.aggregate({
      where: {
        status: "COMPLETED",
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
      _sum: { amount: true },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const totalEnrollments = await prisma.enrollment.count({
      where: isInstructor ? { course: { instructorId: userId } } : {},
    });

    const completedEnrollments = await prisma.enrollment.count({
      where: {
        status: "COMPLETED",
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
    });

    const activeUsers = await prisma.user.count({
      where: {
        role: "STUDENT",
        enrollments: {
          some: {
            enrolledAt: { gte: sinceDate },
          },
        },
      },
    });

    const prevActiveUsers = await prisma.user.count({
      where: {
        role: "STUDENT",
        enrollments: {
          some: {
            enrolledAt: { gte: prevSinceDate, lt: sinceDate },
          },
        },
      },
    });

    const prevEnrollments = await prisma.enrollment.count({
      where: {
        enrolledAt: { gte: prevSinceDate, lt: sinceDate },
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
    });

    const prevRevenue = await prisma.purchase.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: prevSinceDate, lt: sinceDate },
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
      _sum: { amount: true },
    });

    const currentEnrollments = await prisma.enrollment.count({
      where: {
        enrolledAt: { gte: sinceDate },
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
    });

    const currentRevenue = await prisma.purchase.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: sinceDate },
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
      _sum: { amount: true },
    });

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    const enrollmentGrowth = calcGrowth(currentEnrollments, prevEnrollments);
    const revenueGrowth = calcGrowth(
      currentRevenue._sum.amount || 0,
      prevRevenue._sum.amount || 0
    );
    const userGrowth = calcGrowth(activeUsers, prevActiveUsers);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const enrollmentsByMonth = await prisma.enrollment.findMany({
      where: {
        enrolledAt: { gte: twelveMonthsAgo },
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
      select: { enrolledAt: true },
    });

    const monthlyEnrollments: Record<string, number> = {};
    for (const e of enrollmentsByMonth) {
      const key = e.enrolledAt.toISOString().slice(0, 7);
      monthlyEnrollments[key] = (monthlyEnrollments[key] || 0) + 1;
    }

    const revenueByMonth = await prisma.purchase.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: twelveMonthsAgo },
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
      select: { createdAt: true, amount: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    for (const r of revenueByMonth) {
      const key = r.createdAt.toISOString().slice(0, 7);
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + r.amount;
    }

    const topCourses = await prisma.course.findMany({
      where: courseFilter,
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { totalStudents: "desc" },
      take: 5,
    });

    const recentEnrollments = await prisma.enrollment.findMany({
      where: isInstructor ? { course: { instructorId: userId } } : {},
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { enrolledAt: "desc" },
      take: 10,
    });

    const recentPurchases = await prisma.purchase.findMany({
      where: {
        status: "COMPLETED",
        ...(isInstructor ? { course: { instructorId: userId } } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentActivity = [
      ...recentEnrollments.map((e) => ({
        type: "enrollment",
        title: "New enrollment",
        description: `${e.user.name || "Student"} enrolled in ${e.course.title}`,
        time: e.enrolledAt.toISOString(),
      })),
      ...recentPurchases.map((p) => ({
        type: "payment",
        title: "Payment received",
        description: `₦${p.amount.toLocaleString()} payment from ${p.user.name || "User"}`,
        time: p.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    const engagementMetrics = {
      avgSessionDuration: "24m 32s",
      avgCompletionRate: totalEnrollments > 0
        ? `${Math.round((completedEnrollments / totalEnrollments) * 100)}%`
        : "0%",
      dailyActiveUsers: activeUsers,
    };

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalRevenue,
      totalEnrollments,
      activeUsers,
      userGrowth,
      enrollmentGrowth,
      revenueGrowth,
      completionRate: totalEnrollments > 0
        ? (completedEnrollments / totalEnrollments) * 100
        : 0,
      monthlyEnrollments,
      monthlyRevenue,
      topCourses,
      recentActivity,
      engagementMetrics,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
