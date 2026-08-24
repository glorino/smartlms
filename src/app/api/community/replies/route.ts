import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { postId, content } = body;
    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content required" }, { status: 400 });
    }
    const reply = await prisma.forumReply.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
