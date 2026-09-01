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

    const instructorFilter = isInstructor ? { course: { instructorId: userId } } : {};
    const courseFilter = isInstructor ? { instructorId: userId } : {};
    const enrollmentInstructorFilter = isInstructor ? { course: { instructorId: userId } } : {};

    // Run ALL core queries in parallel
    const [
      totalStudents,
      totalCourses,
      revenueResult,
      totalEnrollments,
      completedEnrollments,
      activeUsers,
      prevActiveUsers,
      currentEnrollments,
      prevEnrollments,
      currentRevenue,
      prevRevenue,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count({ where: courseFilter }),
      prisma.purchase.aggregate({
        where: { status: "COMPLETED", ...instructorFilter },
        _sum: { amount: true },
      }),
      prisma.enrollment.count({ where: enrollmentInstructorFilter }),
      prisma.enrollment.count({
        where: { status: "COMPLETED", ...enrollmentInstructorFilter },
      }),
      prisma.user.count({
        where: {
          role: "STUDENT",
          enrollments: { some: { enrolledAt: { gte: sinceDate } } },
        },
      }),
      prisma.user.count({
        where: {
          role: "STUDENT",
          enrollments: { some: { enrolledAt: { gte: prevSinceDate, lt: sinceDate } } },
        },
      }),
      prisma.enrollment.count({
        where: { enrolledAt: { gte: sinceDate }, ...enrollmentInstructorFilter },
      }),
      prisma.enrollment.count({
        where: { enrolledAt: { gte: prevSinceDate, lt: sinceDate }, ...enrollmentInstructorFilter },
      }),
      prisma.purchase.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: sinceDate }, ...instructorFilter },
        _sum: { amount: true },
      }),
      prisma.purchase.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: prevSinceDate, lt: sinceDate }, ...instructorFilter },
        _sum: { amount: true },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;

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

    // Monthly data + recent activity + charts in parallel
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [enrollmentsByMonth, revenueByMonth, recentEnrollments, recentPurchases, topCourses, allPurchases, courseRatings] = await Promise.all([
      prisma.enrollment.findMany({
        where: { enrolledAt: { gte: twelveMonthsAgo }, ...enrollmentInstructorFilter },
        select: { enrolledAt: true },
      }),
      prisma.purchase.findMany({
        where: { status: "COMPLETED", createdAt: { gte: twelveMonthsAgo }, ...instructorFilter },
        select: { createdAt: true, amount: true },
      }),
      prisma.enrollment.findMany({
        where: enrollmentInstructorFilter,
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true } },
        },
        orderBy: { enrolledAt: "desc" },
        take: 10,
      }),
      prisma.purchase.findMany({
        where: { status: "COMPLETED", ...instructorFilter },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.course.findMany({
        where: courseFilter,
        include: { _count: { select: { enrollments: true } } },
        orderBy: { totalStudents: "desc" },
        take: 5,
      }),
      prisma.purchase.findMany({
        where: instructorFilter,
        select: { status: true, amount: true, createdAt: true },
      }),
      isInstructor
        ? prisma.course.findMany({
            where: courseFilter,
            select: { rating: true, totalRatings: true },
          })
        : Promise.resolve([]),
    ]);

    const monthlyEnrollments: Record<string, number> = {};
    for (const e of enrollmentsByMonth) {
      const key = e.enrolledAt.toISOString().slice(0, 7);
      monthlyEnrollments[key] = (monthlyEnrollments[key] || 0) + 1;
    }

    const monthlyRevenue: Record<string, number> = {};
    for (const r of revenueByMonth) {
      const key = r.createdAt.toISOString().slice(0, 7);
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + r.amount;
    }

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

    const totalPayments = allPurchases.length;
    const completedPayments = allPurchases.filter((p) => p.status === "COMPLETED").length;
    const failedPayments = allPurchases.filter((p) => p.status === "FAILED").length;
    const refundedPayments = allPurchases.filter((p) => p.status === "REFUNDED").length;

    // Compute average rating for instructor
    let averageRating = 0;
    if (isInstructor && courseRatings.length > 0) {
      const totalRatingSum = courseRatings.reduce((sum, c) => sum + c.rating * c.totalRatings, 0);
      const totalRatingCount = courseRatings.reduce((sum, c) => sum + c.totalRatings, 0);
      averageRating = totalRatingCount > 0 ? Math.round((totalRatingSum / totalRatingCount) * 10) / 10 : 0;
    }

    // Admin-only data
    let revenueByInstructor: { instructorId: string; instructorName: string; revenue: number }[] = [];
    let categoryDistribution: { category: string; count: number }[] = [];

    if (isAdmin) {
      const [instructorRevenues, coursesWithInstructors, catCourses] = await Promise.all([
        prisma.purchase.groupBy({
          by: ["courseId"],
          where: { status: "COMPLETED" },
          _sum: { amount: true },
        }),
        prisma.course.findMany({
          select: { id: true, instructorId: true, instructor: { select: { name: true } } },
        }),
        prisma.course.groupBy({
          by: ["category"],
          _count: { id: true },
          where: { category: { not: null } },
        }),
      ]);

      const courseMap = new Map<string, { instructorId: string; instructorName: string }>();
      for (const c of coursesWithInstructors) {
        courseMap.set(c.id, { instructorId: c.instructorId, instructorName: c.instructor.name || "Unknown" });
      }
      const revByInstructor = new Map<string, { name: string; revenue: number }>();
      for (const ir of instructorRevenues) {
        if (!ir.courseId) continue;
        const info = courseMap.get(ir.courseId);
        if (info) {
          const existing = revByInstructor.get(info.instructorId) || { name: info.instructorName, revenue: 0 };
          existing.revenue += ir._sum.amount || 0;
          revByInstructor.set(info.instructorId, existing);
        }
      }
      revenueByInstructor = [...revByInstructor.entries()].map(([id, data]) => ({
        instructorId: id,
        instructorName: data.name,
        revenue: Math.round(data.revenue),
      })).sort((a, b) => b.revenue - a.revenue);

      categoryDistribution = catCourses.map((c) => ({
        category: c.category || "Uncategorized",
        count: c._count.id,
      })).sort((a, b) => b.count - a.count);
    }

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalRevenue,
      totalEnrollments,
      activeUsers,
      userGrowth,
      enrollmentGrowth,
      revenueGrowth,
      averageRating,
      completionRate: totalEnrollments > 0
        ? (completedEnrollments / totalEnrollments) * 100
        : 0,
      monthlyEnrollments,
      monthlyRevenue,
      topCourses,
      recentActivity,
      paymentStats: {
        totalPayments,
        completedPayments,
        failedPayments,
        refundedPayments,
        paymentSuccessRate: totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0,
        refundRate: totalPayments > 0 ? Math.round((refundedPayments / totalPayments) * 100) : 0,
      },
      revenueByInstructor,
      categoryDistribution,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
