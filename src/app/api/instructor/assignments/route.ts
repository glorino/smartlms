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
    const userRole = (session.user as any).role;

    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: userId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    const assignments = await prisma.assignment.findMany({
      where: {
        OR: [
          { courseId: { in: courseIds } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const submissions = assignments
      .filter((a) => a.status === "SUBMITTED" || a.status === "GRADED")
      .map((a) => ({
        id: a.id,
        studentName: a.user?.name || "Unknown",
        studentEmail: a.user?.email || "",
        assignmentTitle: a.title,
        course: "",
        courseId: a.courseId || "",
        submittedAt: a.submittedAt?.toISOString() || a.createdAt.toISOString(),
        score: a.score,
        feedback: a.feedback,
        content: a.content,
        status: a.status === "GRADED" ? "graded" : "pending",
      }));

    const stats = {
      totalSubmissions: submissions.length,
      pending: submissions.filter((s) => s.status === "pending").length,
      graded: submissions.filter((s) => s.status === "graded").length,
      avgScore:
        submissions.filter((s) => s.score !== null).length > 0
          ? Math.round(
              submissions
                .filter((s) => s.score !== null)
                .reduce((acc, s) => acc + (s.score || 0), 0) /
                submissions.filter((s) => s.score !== null).length
            )
          : 0,
    };

    return NextResponse.json({ assignments, submissions, stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { assignmentId, grade, feedback } = body;

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        ...(grade !== undefined && { score: Number(grade) }),
        ...(feedback !== undefined && { feedback }),
        ...(grade !== undefined && { status: "GRADED" }),
      },
    });

    return NextResponse.json({ assignment: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
