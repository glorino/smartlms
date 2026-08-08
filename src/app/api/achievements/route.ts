import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { earnedAt: "desc" },
    });

    return NextResponse.json({ achievements });
  } catch {
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
    if (userRole !== "ADMIN" && userRole !== "INSTRUCTOR") {
      return NextResponse.json(
        { error: "Only admins or instructors can award achievements" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, title, description, icon, points, type } = body;

    if (!userId || !title || !type) {
      return NextResponse.json(
        { error: "userId, title, and type are required" },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        userId,
        title,
        description,
        icon,
        points: points || 0,
        type,
        earnedAt: new Date(),
      },
    });

    return NextResponse.json({ achievement }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
