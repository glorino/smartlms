import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            description: true,
            level: true,
            tags: true,
            duration: true,
            instructor: { select: { name: true } },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const isOwner = session?.user?.id === certificate.user.id;

    if (isOwner) {
      return NextResponse.json({
        certificate: {
          id: certificate.id,
          title: certificate.title,
          certificateId: certificate.certificateId,
          status: certificate.status,
          issuedAt: certificate.issuedAt,
          expiresAt: certificate.expiresAt,
          course: certificate.course,
          user: certificate.user,
        },
      });
    }

    return NextResponse.json({
      certificate: {
        title: certificate.title,
        certificateId: certificate.certificateId,
        issuedAt: certificate.issuedAt,
        status: certificate.status,
        course: {
          title: certificate.course.title,
          description: certificate.course.description,
          level: certificate.course.level,
          tags: certificate.course.tags,
          duration: certificate.course.duration,
          instructor: certificate.course.instructor,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
