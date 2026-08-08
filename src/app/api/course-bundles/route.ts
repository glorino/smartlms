import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const bundles = await prisma.courseBundle.findMany({
      where: { isActive: true },
      include: {
        courses: {
          select: { id: true, title: true, thumbnail: true, price: true },
        },
        _count: { select: { purchases: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bundles });
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
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create bundles" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, price, salePrice, thumbnail, courseIds } = body;

    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const bundle = await prisma.courseBundle.create({
      data: {
        title,
        description,
        price,
        salePrice,
        thumbnail,
        courses: courseIds?.length
          ? { connect: courseIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        courses: {
          select: { id: true, title: true, thumbnail: true, price: true },
        },
      },
    });

    return NextResponse.json({ bundle }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
