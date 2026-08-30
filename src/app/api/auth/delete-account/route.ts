import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.bookmark.deleteMany({ where: { userId } });
      await tx.activityLog.deleteMany({ where: { userId } });
      await tx.analyticsEvent.deleteMany({ where: { userId } });
      await tx.lessonProgress.deleteMany({ where: { userId } });
      await tx.note.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.quizAttempt.deleteMany({ where: { userId } });
      await tx.enrollment.deleteMany({ where: { userId } });
      await tx.purchase.deleteMany({ where: { userId } });
      await tx.subscription.deleteMany({ where: { userId } });
      await tx.certificate.deleteMany({ where: { userId } });
      await tx.review.deleteMany({ where: { userId } });
      await tx.message.deleteMany({ where: { senderId: userId } });
      await tx.message.deleteMany({ where: { receiverId: userId } });
      await tx.achievement.deleteMany({ where: { userId } });
      await tx.liveClassAttendance.deleteMany({ where: { userId } });
      await tx.forumPost.deleteMany({ where: { authorId: userId } });
      await tx.forumReply.deleteMany({ where: { authorId: userId } });
      await tx.aIGeneratedContent.deleteMany({ where: { userId } });
      await tx.learningProfile.deleteMany({ where: { userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId } });
      await tx.payout.deleteMany({ where: { instructorId: userId } });

      if (user.role === "INSTRUCTOR") {
        await tx.course.updateMany({ where: { instructorId: userId }, data: { instructorId: "unassigned" } });
      }

      await tx.user.delete({ where: { id: userId } });
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
