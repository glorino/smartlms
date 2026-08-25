import { notFound } from "next/navigation";
import CertificateView from "./certificate-view";
import prisma from "@/lib/prisma";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateId: id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          level: true,
          tags: true,
          duration: true,
          instructor: { select: { name: true, avatar: true } },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <CertificateView
      certificate={{
        certificateId: certificate.certificateId,
        status: certificate.status,
        issuedAt: certificate.issuedAt.toISOString(),
        expiresAt: certificate.expiresAt?.toISOString(),
        title: certificate.title ?? undefined,
        course: certificate.course ? {
          title: certificate.course.title,
          description: certificate.course.description ?? undefined,
          level: certificate.course.level ?? undefined,
          tags: certificate.course.tags ?? undefined,
          duration: certificate.course.duration ?? undefined,
          instructor: certificate.course.instructor ? {
            name: certificate.course.instructor.name ?? "SmartLMS Team",
          } : undefined,
        } : undefined,
        user: certificate.user ? {
          id: certificate.user.id,
          name: certificate.user.name ?? "Student",
          email: certificate.user.email,
        } : undefined,
      }}
    />
  );
}
