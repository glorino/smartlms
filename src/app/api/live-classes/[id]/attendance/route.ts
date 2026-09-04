import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const liveClass = await prisma.liveClass.findUnique({ where: { id } });
    if (!liveClass) {
      return NextResponse.json({ error: "Live class not found" }, { status: 404 });
    }

    await prisma.liveClassAttendance.upsert({
      where: {
        userId_liveClassId: {
          userId: session.user.id,
          liveClassId: id,
        },
      },
      update: {
        joinedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        liveClassId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Record attendance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
