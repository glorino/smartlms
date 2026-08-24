import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");

    const posts = await prisma.forumPost.findMany({
      where: category ? { category } : {},
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        replies: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { title, content, category, tags } = body;
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }
    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        tags,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        replies: true,
      },
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
