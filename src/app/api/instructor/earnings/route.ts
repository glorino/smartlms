import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const purchases = await prisma.purchase.findMany({
      where: {
        course: {
          instructorId: userId,
        },
        status: "COMPLETED",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            instructor: {
              select: { id: true, name: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalEarnings = purchases.reduce((sum, p) => sum + Number(p.amount), 0);
    const thisMonth = purchases
      .filter((p) => {
        const d = new Date(p.createdAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingAmount = await prisma.purchase.aggregate({
      where: { status: "PENDING", course: { instructorId: userId } },
      _sum: { amount: true },
    });
    const pending = pendingAmount._sum.amount || 0;
    const withdrawn = 0; // No withdrawal tracking exists yet; nothing has been withdrawn

    const monthlyData = (() => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const now = new Date();
      return months.map((m, i) => {
        const monthIndex = i;
        const amount = purchases
          .filter((p) => {
            const d = new Date(p.createdAt);
            return d.getMonth() === monthIndex && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + Number(p.amount), 0);
        return { month: m, amount };
      });
    })();

    const transactions = purchases.map((p) => ({
      id: p.id,
      type: "sale" as const,
      description: `Sale of ${p.course?.title || "Course"}`,
      amount: Number(p.amount),
      date: p.createdAt.toISOString(),
      status:
        p.status === "COMPLETED" ? "completed" : p.status === "PENDING" ? "pending" : "completed",
    }));

    const courses = purchases
      .map((p) => p.course)
      .filter((c) => c !== null && c !== undefined)
      .filter((c, index, self) => self.findIndex((s) => s.id === c.id) === index);

    return NextResponse.json({
      purchases,
      earnings: {
        totalEarnings,
        thisMonth,
        pending,
        withdrawn,
        monthlyData,
        transactions,
        courses,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
