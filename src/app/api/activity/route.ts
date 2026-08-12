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
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      icon: string;
      color: string;
    }> = [];

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
      orderBy: { enrolledAt: "desc" },
      take: 10,
    });

    for (const e of enrollments) {
      activities.push({
        id: `enrollment-${e.id}`,
        type: "enrollment",
        title: `Enrolled in ${e.course.title}`,
        description: `Started a new course`,
        timestamp: e.enrolledAt.toISOString(),
        icon: "trending",
        color: "bg-purple-500",
      });
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
      orderBy: { issuedAt: "desc" },
      take: 5,
    });

    for (const c of certificates) {
      activities.push({
        id: `certificate-${c.id}`,
        type: "certificate",
        title: "Certificate Earned",
        description: `Completed ${c.course.title}`,
        timestamp: c.issuedAt.toISOString(),
        icon: "award",
        color: "bg-amber-500",
      });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ activities: activities.slice(0, 20) });
  } catch {
    return NextResponse.json({ activities: [] });
  }
}
