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
    const { postId, replyId } = body;

    if (postId) {
      const post = await prisma.forumPost.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ likes: post.likes });
    }
    if (replyId) {
      const reply = await prisma.forumReply.update({
        where: { id: replyId },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ likes: reply.likes });
    }
    return NextResponse.json({ error: "postId or replyId required" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
