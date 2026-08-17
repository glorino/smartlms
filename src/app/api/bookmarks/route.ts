import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
            level: true,
            rating: true,
            price: true,
            thumbnail: true,
            duration: true,
            description: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks });
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
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already bookmarked" },
        { status: 409 }
      );
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const bookmarkId = searchParams.get("id");

    if (bookmarkId) {
      const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId },
      });

      if (!bookmark) {
        return NextResponse.json(
          { error: "Bookmark not found" },
          { status: 404 }
        );
      }

      if (bookmark.userId !== userId) {
        return NextResponse.json(
          { error: "Not authorized to delete this bookmark" },
          { status: 403 }
        );
      }

      await prisma.bookmark.delete({ where: { id: bookmarkId } });
      return NextResponse.json({ message: "Bookmark removed" });
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Bookmark ID or course ID is required" },
        { status: 400 }
      );
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
