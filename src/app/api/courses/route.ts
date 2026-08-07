import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const price = searchParams.get("price") || "";
    const rating = searchParams.get("rating") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (price === "free") {
      where.price = 0;
    } else if (price === "paid") {
      where.price = { gt: 0 };
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    let orderBy: any;
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "popular":
        orderBy = { totalStudents: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          _count: { select: { enrollments: true, reviews: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
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
    const userRole = (session.user as any).role;
    if (userRole !== "INSTRUCTOR" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only instructors can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, price, category, level, thumbnail, tags, shortDescription } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingSlug = await prisma.course.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const course = await prisma.course.create({
      data: {
        title,
        slug: finalSlug,
        description,
        shortDescription,
        price: price || 0,
        category,
        level: level || "BEGINNER",
        thumbnail,
        tags: tags || [],
        instructorId: userId,
        status: "DRAFT",
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}