import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update user roles" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { role, isBlocked, name, email } = body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) {
      updateData.name = String(name).trim();
    }
    if (email !== undefined) {
      const emailStr = String(email).trim().toLowerCase();
      if (!emailStr || !emailStr.includes("@")) {
        return NextResponse.json(
          { error: "Valid email is required" },
          { status: 400 }
        );
      }
      if (emailStr !== user.email) {
        const existing = await prisma.user.findUnique({ where: { email: emailStr } });
        if (existing) {
          return NextResponse.json(
            { error: "Email is already in use" },
            { status: 400 }
          );
        }
      }
      updateData.email = emailStr;
    }
    if (role !== undefined) {
      if (!["STUDENT", "INSTRUCTOR", "ADMIN"].includes(role)) {
        return NextResponse.json(
          { error: "Valid role is required (STUDENT, INSTRUCTOR, ADMIN)" },
          { status: 400 }
        );
      }
      updateData.role = role;
    }
    if (isBlocked !== undefined) {
      updateData.isBlocked = Boolean(isBlocked);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, avatar: true, isBlocked: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete users" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Quiz attempts
      await tx.quizAttempt.deleteMany({ where: { user: { id } } });
      // Notes
      await tx.note.deleteMany({ where: { user: { id } } });
      // Reviews
      await tx.review.deleteMany({ where: { user: { id } } });
      // Bookmarks
      await tx.bookmark.deleteMany({ where: { user: { id } } });
      // Notifications
      await tx.notification.deleteMany({ where: { userId: id } });
      // Messages sent and received
      await tx.message.deleteMany({ where: { senderId: id } });
      await tx.message.deleteMany({ where: { receiverId: id } });
      // Lesson progress
      await tx.lessonProgress.deleteMany({ where: { user: { id } } });
      // Certificates
      await tx.certificate.deleteMany({ where: { userId: id } });
      // Enrollments
      await tx.enrollment.deleteMany({ where: { userId: id } });
      // Purchases
      await tx.purchase.deleteMany({ where: { userId: id } });
      // Live class attendances
      await tx.liveClassAttendance.deleteMany({ where: { user: { id } } });
      // Assignments
      await tx.assignment.deleteMany({ where: { userId: id } });
      // Grades
      await tx.grade.deleteMany({ where: { userId: id } });
      // User
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
