import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const totalStudents = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    const totalCourses = await prisma.course.count({
      where: (session.user as any).role === "INSTRUCTOR"
        ? { instructorId: session.user.id }
        : {},
    });

    const totalRevenue = await prisma.purchase.aggregate({
      where: {
        status: "COMPLETED",
        ...((session.user as any).role === "INSTRUCTOR"
          ? { course: { instructorId: session.user.id } }
          : {}),
      },
      _sum: { amount: true },
    });

    const totalEnrollments = await prisma.enrollment.count({
      where: (session.user as any).role === "INSTRUCTOR"
        ? { course: { instructorId: session.user.id } }
        : {},
    });

    const completedEnrollments = await prisma.enrollment.count({
      where: {
        status: "COMPLETED",
        ...((session.user as any).role === "INSTRUCTOR"
          ? { course: { instructorId: session.user.id } }
          : {}),
      },
    });

    const completionRate = totalEnrollments > 0
      ? (completedEnrollments / totalEnrollments) * 100
      : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const enrollmentsByDate = await prisma.enrollment.groupBy({
      by: ["enrolledAt"],
      where: {
        enrolledAt: { gte: thirtyDaysAgo },
        ...((session.user as any).role === "INSTRUCTOR"
          ? { course: { instructorId: session.user.id } }
          : {}),
      },
      _count: true,
    });

    const revenueByDate = await prisma.purchase.groupBy({
      by: ["createdAt"],
      where: {
        status: "COMPLETED",
        createdAt: { gte: thirtyDaysAgo },
        ...((session.user as any).role === "INSTRUCTOR"
          ? { course: { instructorId: session.user.id } }
          : {}),
      },
      _sum: { amount: true },
    });

    const topCourses = await prisma.course.findMany({
      where: (session.user as any).role === "INSTRUCTOR"
        ? { instructorId: session.user.id }
        : {},
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { totalStudents: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalEnrollments,
      completionRate,
      enrollments: enrollmentsByDate.map((e: any) => ({
        date: e.enrolledAt.toISOString().split("T")[0],
        count: e._count,
      })),
      revenue: revenueByDate.map((r: any) => ({
        date: r.createdAt.toISOString().split("T")[0],
        amount: r._sum.amount || 0,
      })),
      topCourses,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}