import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = await prisma.siteSettings.findMany();

    const settingsMap: Record<string, any> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update settings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "settings object is required" },
        { status: 400 }
      );
    }

    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.siteSettings.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      );
    }

    await Promise.all(updates);

    const allSettings = await prisma.siteSettings.findMany();
    const settingsMap: Record<string, any> = {};
    for (const setting of allSettings) {
      settingsMap[setting.key] = setting.value;
    }

    return NextResponse.json({ settings: settingsMap });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
