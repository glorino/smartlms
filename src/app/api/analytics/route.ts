import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

function ok<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

function okNum(result: PromiseSettledResult<any>, fallback = 0): number {
  if (result.status !== "fulfilled") return fallback;
  if (result.value?._sum?.amount != null) return result.value._sum.amount;
  if (typeof result.value === "number") return result.value;
  return fallback;
}

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

    const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
    const days = daysMap[range] || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const prevSinceDate = new Date(sinceDate);
    prevSinceDate.setDate(prevSinceDate.getDate() - days);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const iFilter = isInstructor ? { course: { instructorId: userId } } : {};
    const cFilter = isInstructor ? { instructorId: userId } : {};
    const eFilter = isInstructor ? { course: { instructorId: userId } } : {};

    // Batch 1: Core counts — ALL in parallel, ALL resilient
    const b1 = await Promise.allSettled([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count({ where: cFilter }),
      prisma.purchase.aggregate({ where: { status: "COMPLETED", ...iFilter }, _sum: { amount: true } }),
      prisma.enrollment.count({ where: eFilter }),
      prisma.enrollment.count({ where: { status: "COMPLETED", ...eFilter } }),
      prisma.user.count({ where: { role: "STUDENT", enrollments: { some: { enrolledAt: { gte: sinceDate } } } } }),
      prisma.user.count({ where: { role: "STUDENT", enrollments: { some: { enrolledAt: { gte: prevSinceDate, lt: sinceDate } } } } }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: sinceDate }, ...eFilter } }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: prevSinceDate, lt: sinceDate }, ...eFilter } }),
      prisma.purchase.aggregate({ where: { status: "COMPLETED", createdAt: { gte: sinceDate }, ...iFilter }, _sum: { amount: true } }),
      prisma.purchase.aggregate({ where: { status: "COMPLETED", createdAt: { gte: prevSinceDate, lt: sinceDate }, ...iFilter }, _sum: { amount: true } }),
    ]);

    const totalStudents = ok(b1[0], 0);
    const totalCourses = ok(b1[1], 0);
    const totalRevenue = okNum(b1[2]);
    const totalEnrollments = ok(b1[3], 0);
    const completedEnrollments = ok(b1[4], 0);
    const activeUsers = ok(b1[5], 0);
    const prevActiveUsers = ok(b1[6], 0);
    const currentEnrollments = ok(b1[7], 0);
    const prevEnrollments = ok(b1[8], 0);
    const currentRevenueAmt = okNum(b1[9]);
    const prevRevenueAmt = okNum(b1[10]);

    const calcGrowth = (c: number, p: number) => {
      if (p === 0) return c > 0 ? 100 : 0;
      return Math.round(((c - p) / p) * 100 * 10) / 10;
    };

    // Batch 2: Monthly data, activity, charts — ALL in parallel, ALL resilient
    const b2 = await Promise.allSettled([
      prisma.enrollment.findMany({ where: { enrolledAt: { gte: twelveMonthsAgo }, ...eFilter }, select: { enrolledAt: true } }),
      prisma.purchase.findMany({ where: { status: "COMPLETED", createdAt: { gte: twelveMonthsAgo }, ...iFilter }, select: { createdAt: true, amount: true } }),
      prisma.enrollment.findMany({ where: eFilter, include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } }, orderBy: { enrolledAt: "desc" }, take: 10 }),
      prisma.purchase.findMany({ where: { status: "COMPLETED", ...iFilter }, include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true } } }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.course.findMany({ where: cFilter, include: { _count: { select: { enrollments: true } } }, orderBy: { totalStudents: "desc" }, take: 5 }),
      prisma.purchase.findMany({ where: iFilter, select: { status: true, amount: true, createdAt: true } }),
      isInstructor ? prisma.course.findMany({ where: cFilter, select: { rating: true, totalRatings: true } }) : Promise.resolve([]),
    ]);

    const enrollmentsByMonth = ok(b2[0], []);
    const revenueByMonthRaw = ok(b2[1], []);
    const recentEnrollments = ok(b2[2], []);
    const recentPurchases = ok(b2[3], []);
    const topCourses = ok(b2[4], []);
    const allPurchases = ok(b2[5], []);
    const courseRatings = ok(b2[6], []);

    const monthlyEnrollments: Record<string, number> = {};
    for (const e of enrollmentsByMonth) {
      const key = e.enrolledAt.toISOString().slice(0, 7);
      monthlyEnrollments[key] = (monthlyEnrollments[key] || 0) + 1;
    }

    const monthlyRevenue: Record<string, number> = {};
    for (const r of revenueByMonthRaw) {
      const key = r.createdAt.toISOString().slice(0, 7);
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + r.amount;
    }

    const recentActivity = [
      ...recentEnrollments.map((e: any) => ({
        type: "enrollment",
        title: "New enrollment",
        description: `${e.user?.name || "Student"} enrolled in ${e.course?.title || "Course"}`,
        time: e.enrolledAt.toISOString(),
      })),
      ...recentPurchases.map((p: any) => ({
        type: "payment",
        title: "Payment received",
        description: `₦${p.amount.toLocaleString()} payment from ${p.user?.name || "User"}`,
        time: p.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    const totalPayments = allPurchases.length;
    const completedPayments = allPurchases.filter((p: any) => p.status === "COMPLETED").length;
    const failedPayments = allPurchases.filter((p: any) => p.status === "FAILED").length;
    const refundedPayments = allPurchases.filter((p: any) => p.status === "REFUNDED").length;

    let averageRating = 0;
    if (isInstructor && courseRatings.length > 0) {
      const totalRatingSum = courseRatings.reduce((sum: number, c: any) => sum + c.rating * c.totalRatings, 0);
      const totalRatingCount = courseRatings.reduce((sum: number, c: any) => sum + c.totalRatings, 0);
      averageRating = totalRatingCount > 0 ? Math.round((totalRatingSum / totalRatingCount) * 10) / 10 : 0;
    }

    // Batch 3: Admin-only data — resilient
    let revenueByInstructor: { instructorId: string; instructorName: string; revenue: number }[] = [];
    let categoryDistribution: { category: string; count: number }[] = [];

    if (isAdmin) {
      const b3 = await Promise.allSettled([
        prisma.purchase.groupBy({ by: ["courseId"], where: { status: "COMPLETED" }, _sum: { amount: true } }),
        prisma.course.findMany({ select: { id: true, instructorId: true, instructor: { select: { name: true } } } }),
        prisma.course.groupBy({ by: ["category"], _count: { id: true }, where: { category: { not: null } } }),
      ]);

      const instructorRevenues = ok(b3[0], []);
      const coursesWithInstructors = ok(b3[1], []);
      const catCourses = ok(b3[2], []);

      const courseMap = new Map<string, { instructorId: string; instructorName: string }>();
      for (const c of coursesWithInstructors) {
        courseMap.set(c.id, { instructorId: c.instructorId, instructorName: c.instructor?.name || "Unknown" });
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
        instructorId: id, instructorName: data.name, revenue: Math.round(data.revenue),
      })).sort((a, b) => b.revenue - a.revenue);

      categoryDistribution = catCourses.map((c: any) => ({
        category: c.category || "Uncategorized", count: c._count.id,
      })).sort((a, b) => b.count - a.count);
    }

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalRevenue,
      totalEnrollments,
      activeUsers,
      userGrowth: calcGrowth(activeUsers, prevActiveUsers),
      enrollmentGrowth: calcGrowth(currentEnrollments, prevEnrollments),
      revenueGrowth: calcGrowth(currentRevenueAmt, prevRevenueAmt),
      averageRating,
      completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0,
      monthlyEnrollments,
      monthlyRevenue,
      topCourses,
      recentActivity,
      paymentStats: {
        totalPayments, completedPayments, failedPayments, refundedPayments,
        paymentSuccessRate: totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0,
        refundRate: totalPayments > 0 ? Math.round((refundedPayments / totalPayments) * 100) : 0,
      },
      revenueByInstructor,
      categoryDistribution,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
