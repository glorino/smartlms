import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { courseId } = await params;

    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: session.user.id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        section: { courseId },
      },
      select: {
        id: true,
        title: true,
        type: true,
        order: true,
        section: { select: { title: true } },
      },
      orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
