import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      role,
      professionalHeadline,
      bio,
      expertise,
      experience,
      portfolioUrl,
      linkedinUrl,
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

    let bioField: string | undefined;
    if (role === "INSTRUCTOR") {
      const instructorData = {
        professionalHeadline: professionalHeadline || "",
        bio: bio || "",
        expertise: expertise || [],
        experience: experience || "",
        portfolioUrl: portfolioUrl || "",
        linkedinUrl: linkedinUrl || "",
      };
      bioField = JSON.stringify(instructorData);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        ...(bioField && { bio: bioField }),
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
