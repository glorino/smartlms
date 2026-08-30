import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    if (!await checkRateLimit("register", 3, 3600000, request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown")) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
    const body = await request.json();
    const {
      name,
      email,
      password,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
