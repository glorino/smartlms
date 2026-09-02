import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, middleName, dateOfBirth, gender, bloodGroup,
      nationality, stateOfOrigin, homeAddress, email, phone,
      previousSchool, previousScore,
      guardianName, guardianRelationship, guardianPhone, guardianEmail,
      documents,
    } = body;

    if (!firstName || !lastName || !dateOfBirth || !gender || !homeAddress || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const count = await prisma.admissionApplication.count();
    const year = new Date().getFullYear();
    const applicationNumber = `APP/${year}/${String(count + 1).padStart(4, "0")}`;

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNumber,
        firstName,
        lastName,
        middleName: middleName || null,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        bloodGroup: bloodGroup || null,
        nationality: nationality || "Nigerian",
        stateOfOrigin: stateOfOrigin || null,
        homeAddress,
        email,
        phone,
        previousSchool: previousSchool || null,
        previousScore: previousScore || null,
        guardianName: guardianName || null,
        guardianRelationship: guardianRelationship || null,
        guardianPhone: guardianPhone || null,
        guardianEmail: guardianEmail || null,
        documents: documents || [],
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Create admission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (status) where.status = status;

    const applications = await prisma.admissionApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("List admissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
