import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = { userId: session.user.id };

    if (filter === "unread") {
      where.read = false;
    } else if (filter !== "all") {
      where.type = filter;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: session.user.id, read: false } }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Only admins and instructors can send notifications" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type = "system", targetAudience, targetCourseId, targetUserIds, scheduledAt } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    if (!targetAudience) {
      return NextResponse.json({ error: "Target audience is required" }, { status: 400 });
    }

    let recipientIds: string[] = [];

    if (targetAudience === "all_students") {
      const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: { id: true },
      });
      recipientIds = students.map((s) => s.id);
    } else if (targetAudience === "specific_course" && targetCourseId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: targetCourseId },
        select: { userId: true },
      });
      recipientIds = enrollments.map((e) => e.userId);
    } else if (targetAudience === "individual" && targetUserIds?.length > 0) {
      recipientIds = targetUserIds;
    }

    if (recipientIds.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 });
    }

    const notificationData = recipientIds.map((userId) => ({
      title,
      message,
      type,
      userId,
    }));

    await prisma.notification.createMany({
      data: notificationData,
    });

    return NextResponse.json({
      success: true,
      recipientsCount: recipientIds.length,
      message: `Notification sent to ${recipientIds.length} recipients`,
    });
  } catch (error) {
    console.error("Notification send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, notificationIds } = body;

    if (action === "mark_read") {
      if (notificationIds && notificationIds.length > 0) {
        await prisma.notification.updateMany({
          where: { id: { in: notificationIds }, userId: session.user.id },
          data: { read: true },
        });
      } else {
        await prisma.notification.updateMany({
          where: { userId: session.user.id, read: false },
          data: { read: true },
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
