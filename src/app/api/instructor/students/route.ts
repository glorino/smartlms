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

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: { instructorId: userId },
      },
      select: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    const seen = new Set<string>();
    const students: { id: string; name: string | null; email: string; avatar: string | null }[] = [];

    for (const e of enrollments) {
      if (!seen.has(e.user.id)) {
        seen.add(e.user.id);
        students.push(e.user);
      }
    }

    students.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Fetch instructor students error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
