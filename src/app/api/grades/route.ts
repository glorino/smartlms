import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const grades = await prisma.grade.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const averageScore =
      grades.length > 0
        ? grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length
        : 0;

    return NextResponse.json({ grades, averageScore });
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

    const userId = session.user.id;
    const body = await request.json();
    const { score, totalPoints, type } = body;

    if (score === undefined || totalPoints === undefined) {
      return NextResponse.json(
        { error: "score and totalPoints are required" },
        { status: 400 }
      );
    }

    if (totalPoints <= 0) {
      return NextResponse.json(
        { error: "totalPoints must be greater than 0" },
        { status: 400 }
      );
    }

    const percentage = (score / totalPoints) * 100;
    let letterGrade: string;

    if (percentage >= 90) letterGrade = "A";
    else if (percentage >= 80) letterGrade = "B";
    else if (percentage >= 70) letterGrade = "C";
    else if (percentage >= 60) letterGrade = "D";
    else letterGrade = "F";

    const grade = await prisma.grade.create({
      data: {
        userId,
        score,
        totalPoints,
        percentage,
        letterGrade,
        type: type || "QUIZ",
      },
    });

    return NextResponse.json({ grade }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
