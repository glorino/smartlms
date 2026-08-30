import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

function escapeCSVField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const assignmentId = searchParams.get("assignmentId");

    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: userId },
      select: { id: true },
    });

    const courseIds = instructorCourses.map((c) => c.id);

    const assignmentWhere: any = {
      OR: [
        { courseId: { in: courseIds } },
      ],
    };

    if (assignmentId) {
      assignmentWhere.id = assignmentId;
    }

    const assignments = await prisma.assignment.findMany({
      where: assignmentWhere,
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

    if (format === "csv") {
      const header = "Assignment Title,Student Name,Student Email,Submission Content,Submitted At,Grade,Feedback";
      const rows = submissions.map((s) => {
        return [
          escapeCSVField(s.assignmentTitle),
          escapeCSVField(s.studentName),
          escapeCSVField(s.studentEmail),
          escapeCSVField(s.content || ""),
          escapeCSVField(s.submittedAt),
          escapeCSVField(s.score !== null ? String(s.score) : ""),
          escapeCSVField(s.feedback || ""),
        ].join(",");
      });
      const csv = [header, ...rows].join("\r\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="submissions.csv"',
        },
      });
    }

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

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: { select: { instructorId: true } } },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (userRole !== "ADMIN" && assignment.course?.instructorId !== session.user.id) {
      return NextResponse.json({ error: "You can only grade assignments from your own courses" }, { status: 403 });
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
