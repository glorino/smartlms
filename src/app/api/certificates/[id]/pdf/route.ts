import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jsPDF } from "jspdf";

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
        course: { select: { title: true, instructor: { select: { name: true } } } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    if (session?.user?.id !== certificate.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const issuedDate = certificate.issuedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const instructorName = certificate.course.instructor?.name || "SmartLMS Team";

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.setFillColor(255, 254, 247);
    doc.rect(0, 0, w, h, "F");

    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1.5);
    doc.roundedRect(8, 8, w - 16, h - 16, 4, 4, "S");

    doc.setDrawColor(165, 180, 252);
    doc.setLineWidth(0.5);
    doc.roundedRect(12, 12, w - 24, h - 24, 3, 3, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(99, 102, 241);
    doc.text("CERTIFICATE OF COMPLETION", w / 2, 28, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text("SmartLMS", w / 2, 36, { align: "center" });

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(w / 2 - 30, 40, w / 2 + 30, 40);

    doc.setFontSize(13);
    doc.setTextColor(107, 114, 128);
    doc.text("This is to certify that", w / 2, 52, { align: "center" });

    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text(certificate.user.name || "Student", w / 2, 66, { align: "center" });

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(w / 2 - 40, 70, w / 2 + 40, 70);

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("has successfully completed the course", w / 2, 80, { align: "center" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(99, 102, 241);
    doc.text(certificate.course.title, w / 2, 92, { align: "center" });

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(30, 102, w - 30, 102);

    const col1 = w * 0.25;
    const col2 = w * 0.5;
    const col3 = w * 0.75;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text("INSTRUCTOR", col1, 110, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text(instructorName, col1, 116, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text("DATE ISSUED", col2, 110, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text(issuedDate, col2, 116, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text("CERTIFICATE ID", col3, 110, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 65, 81);
    doc.text(certificate.certificateId, col3, 116, { align: "center" });

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.3);
    doc.line(col1 - 25, 120, col1 + 25, 120);
    doc.line(col2 - 25, 120, col2 + 25, 120);
    doc.line(col3 - 25, 120, col3 + 25, 120);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    doc.text("INSTRUCTOR SIGNATURE", col1, 124, { align: "center" });
    doc.text("DATE", col2, 124, { align: "center" });
    doc.text("VERIFICATION ID", col3, 124, { align: "center" });

    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text("Verify at: smartlms-bay.vercel.app/verify-certificate?id=" + certificate.certificateId, w / 2, h - 14, { align: "center" });

    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text("This certificate was issued by SmartLMS Platform", w / 2, h - 10, { align: "center" });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SmartLMS-Certificate-${certificate.certificateId}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
