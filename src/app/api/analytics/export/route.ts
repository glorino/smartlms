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
    const userId = (session.user as any).id;
    const isInstructor = userRole === "INSTRUCTOR";
    const isAdmin = userRole === "ADMIN";

    if (!isInstructor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const courseId = searchParams.get("courseId");
    const type = searchParams.get("type") || "students";

    const courseFilter: any = isInstructor ? { instructorId: userId } : {};
    if (courseId) courseFilter.id = courseId;

    const courses = await prisma.course.findMany({
      where: courseFilter,
      select: { id: true, title: true },
    });
    const courseIds = courses.map((c) => c.id);

    if (format === "csv") {
      return generateCSV(type, courseIds);
    } else if (format === "pdf") {
      return generatePDF(type, courseIds);
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(d: Date | string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function generateCSV(type: string, courseIds: string[]) {
  switch (type) {
    case "students": {
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
        orderBy: { enrolledAt: "desc" },
      });

      const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
          userId: { in: [...new Set(enrollments.map((e) => e.userId))] },
          quiz: { courseId: { in: courseIds } },
        },
        select: {
          userId: true,
          score: true,
          totalPoints: true,
          quiz: { select: { courseId: true } },
        },
      });

      const headers = [
        "Student Name",
        "Email",
        "Course",
        "Enrollment Date",
        "Progress (%)",
        "Status",
        "Avg Quiz Score (%)",
      ];

      const rows = enrollments.map((e) => {
        const studentAttempts = quizAttempts.filter(
          (qa) => qa.userId === e.userId && qa.quiz?.courseId === e.courseId
        );
        const avgScore =
          studentAttempts.length > 0
            ? Math.round(
                studentAttempts
                  .filter((qa) => qa.totalPoints > 0)
                  .reduce(
                    (sum, qa) => sum + (qa.score / qa.totalPoints) * 100,
                    0
                  ) / studentAttempts.length
              )
            : 0;

        return [
          escapeCSV(e.user.name || "Unknown"),
          escapeCSV(e.user.email),
          escapeCSV(e.course.title),
          escapeCSV(formatDate(e.enrolledAt)),
          escapeCSV(Math.round(e.progress)),
          escapeCSV(e.status),
          escapeCSV(avgScore),
        ].join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="students-report-${Date.now()}.csv"`,
        },
      });
    }

    case "engagement": {
      const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, totalStudents: true },
      });

      const allEnrollments = await prisma.enrollment.findMany({
        where: { courseId: { in: courseIds } },
        select: { courseId: true, progress: true, status: true },
      });

      const quizAttempts = await prisma.quizAttempt.findMany({
        where: { quiz: { courseId: { in: courseIds } } },
        select: {
          score: true,
          totalPoints: true,
          quiz: { select: { courseId: true } },
        },
      });

      const headers = [
        "Course",
        "Total Enrollments",
        "Completion Rate (%)",
        "Avg Quiz Score (%)",
        "Drop-off Rate (%)",
      ];

      const rows = courses.map((course) => {
        const courseEnrollments = allEnrollments.filter(
          (e) => e.courseId === course.id
        );
        const completed = courseEnrollments.filter(
          (e) => e.status === "COMPLETED"
        ).length;
        const total = courseEnrollments.length;
        const completionRate =
          total > 0 ? Math.round((completed / total) * 100) : 0;
        const dropOffRate =
          total > 0 ? Math.round(((total - completed) / total) * 100) : 0;

        const courseQuizzes = quizAttempts.filter(
          (qa) => qa.quiz?.courseId === course.id && qa.totalPoints > 0
        );
        const avgQuizScore =
          courseQuizzes.length > 0
            ? Math.round(
                courseQuizzes.reduce(
                  (sum, qa) => sum + (qa.score / qa.totalPoints) * 100,
                  0
                ) / courseQuizzes.length
              )
            : 0;

        return [
          escapeCSV(course.title),
          escapeCSV(total),
          escapeCSV(completionRate),
          escapeCSV(avgQuizScore),
          escapeCSV(dropOffRate),
        ].join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="engagement-report-${Date.now()}.csv"`,
        },
      });
    }

    case "revenue": {
      const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, totalStudents: true },
      });

      const purchases = await prisma.purchase.findMany({
        where: { courseId: { in: courseIds }, status: "COMPLETED" },
        select: { courseId: true, amount: true, createdAt: true },
      });

      const headers = [
        "Course",
        "Total Sales",
        "Total Revenue (₦)",
        "Avg Revenue Per Student (₦)",
      ];

      const rows = courses.map((course) => {
        const coursePurchases = purchases.filter(
          (p) => p.courseId === course.id
        );
        const revenue = coursePurchases.reduce((sum, p) => sum + p.amount, 0);
        const avgPerStudent =
          course.totalStudents > 0
            ? Math.round(revenue / course.totalStudents)
            : 0;

        return [
          escapeCSV(course.title),
          escapeCSV(coursePurchases.length),
          escapeCSV(Math.round(revenue)),
          escapeCSV(avgPerStudent),
        ].join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="revenue-report-${Date.now()}.csv"`,
        },
      });
    }

    default:
      return new NextResponse("Invalid type", { status: 400 });
  }
}

async function generatePDF(type: string, courseIds: string[]) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let title = "";
  let headers: string[] = [];
  let rows: string[][] = [];

  switch (type) {
    case "students": {
      title = "Students Report";
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: { in: courseIds } },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
        orderBy: { enrolledAt: "desc" },
      });

      const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
          userId: { in: [...new Set(enrollments.map((e) => e.userId))] },
          quiz: { courseId: { in: courseIds } },
        },
        select: {
          userId: true,
          score: true,
          totalPoints: true,
          quiz: { select: { courseId: true } },
        },
      });

      headers = ["Name", "Email", "Course", "Enrolled", "Progress", "Status"];
      rows = enrollments.map((e) => {
        const studentAttempts = quizAttempts.filter(
          (qa) => qa.userId === e.userId && qa.quiz?.courseId === e.courseId
        );
        const avgScore =
          studentAttempts.length > 0
            ? Math.round(
                studentAttempts
                  .filter((qa) => qa.totalPoints > 0)
                  .reduce(
                    (sum, qa) => sum + (qa.score / qa.totalPoints) * 100,
                    0
                  ) / studentAttempts.length
              )
            : 0;
        return [
          e.user.name || "Unknown",
          e.user.email,
          e.course.title,
          formatDate(e.enrolledAt),
          `${Math.round(e.progress)}% (Quiz: ${avgScore}%)`,
          e.status,
        ];
      });
      break;
    }

    case "engagement": {
      title = "Engagement Report";
      const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, totalStudents: true },
      });

      const allEnrollments = await prisma.enrollment.findMany({
        where: { courseId: { in: courseIds } },
        select: { courseId: true, status: true },
      });

      const quizAttempts = await prisma.quizAttempt.findMany({
        where: { quiz: { courseId: { in: courseIds } } },
        select: {
          score: true,
          totalPoints: true,
          quiz: { select: { courseId: true } },
        },
      });

      headers = [
        "Course",
        "Enrollments",
        "Completion Rate",
        "Avg Quiz Score",
        "Drop-off Rate",
      ];
      rows = courses.map((course) => {
        const courseEnrollments = allEnrollments.filter(
          (e) => e.courseId === course.id
        );
        const completed = courseEnrollments.filter(
          (e) => e.status === "COMPLETED"
        ).length;
        const total = courseEnrollments.length;
        const courseQuizzes = quizAttempts.filter(
          (qa) => qa.quiz?.courseId === course.id && qa.totalPoints > 0
        );
        const avgQuiz =
          courseQuizzes.length > 0
            ? Math.round(
                courseQuizzes.reduce(
                  (sum, qa) => sum + (qa.score / qa.totalPoints) * 100,
                  0
                ) / courseQuizzes.length
              )
            : 0;
        return [
          course.title,
          String(total),
          `${total > 0 ? Math.round((completed / total) * 100) : 0}%`,
          `${avgQuiz}%`,
          `${total > 0 ? Math.round(((total - completed) / total) * 100) : 0}%`,
        ];
      });
      break;
    }

    case "revenue": {
      title = "Revenue Report";
      const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, totalStudents: true },
      });

      const purchases = await prisma.purchase.findMany({
        where: { courseId: { in: courseIds }, status: "COMPLETED" },
        select: { courseId: true, amount: true },
      });

      headers = [
        "Course",
        "Total Sales",
        "Total Revenue (₦)",
        "Avg Per Student (₦)",
      ];
      rows = courses.map((course) => {
        const cp = purchases.filter((p) => p.courseId === course.id);
        const rev = cp.reduce((sum, p) => sum + p.amount, 0);
        return [
          course.title,
          String(cp.length),
          `₦${Math.round(rev).toLocaleString()}`,
          course.totalStudents > 0
            ? `₦${Math.round(rev / course.totalStudents).toLocaleString()}`
            : "₦0",
        ];
      });
      break;
    }

    default:
      return new NextResponse("Invalid type", { status: 400 });
  }

  const thHtml = headers
    .map(
      (h) =>
        `<th style="padding:12px 16px;text-align:left;background:#4f46e5;color:white;font-weight:600;border-bottom:2px solid #3730a3;">${h}</th>`
    )
    .join("");

  const trHtml = rows
    .map(
      (row, idx) =>
        `<tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f9fafb"};">${row
          .map(
            (cell) =>
              `<td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;">${cell}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} - SmartLMS</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none !important; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1f2937; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo { width: 40px; height: 40px; background: #4f46e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; }
    .brand-text h1 { font-size: 24px; font-weight: 700; color: #111827; }
    .brand-text p { font-size: 14px; color: #6b7280; margin-top: 2px; }
    .meta { text-align: right; }
    .meta .title { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 4px; }
    .meta .date { font-size: 13px; color: #6b7280; }
    .meta .count { font-size: 14px; color: #4f46e5; font-weight: 600; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 14px; }
    tr:last-child td { border-bottom: none; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; }
    .print-btn { position: fixed; bottom: 24px; right: 24px; padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(79,70,229,0.4); }
    .print-btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo">S</div>
      <div class="brand-text">
        <h1>SmartLMS</h1>
        <p>Learning Management System</p>
      </div>
    </div>
    <div class="meta">
      <div class="title">${title}</div>
      <div class="date">Generated: ${date}</div>
      <div class="count">${rows.length} record${rows.length !== 1 ? "s" : ""}</div>
    </div>
  </div>
  <table>
    <thead><tr>${thHtml}</tr></thead>
    <tbody>${trHtml}</tbody>
  </table>
  <div class="footer">
    <span>SmartLMS Analytics Report</span>
    <span>Page 1 of 1</span>
  </div>
  <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
