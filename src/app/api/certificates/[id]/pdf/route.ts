import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();

    const courseSelect = {
      title: true,
      description: true,
      level: true,
      tags: true,
      duration: true,
      instructor: { select: { name: true, image: true } },
    };

    let certificate = await prisma.certificate.findUnique({
      where: { certificateId: id },
      include: {
        course: { select: courseSelect },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!certificate) {
      certificate = await prisma.certificate.findUnique({
        where: { id },
        include: {
          course: { select: courseSelect },
          user: { select: { id: true, name: true, email: true } },
        },
      });
    }

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (session?.user?.id !== certificate.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const issuedDate = certificate.issuedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const instructorName =
      certificate.course.instructor?.name || "SmartLMS Team";
    const certPageUrl = `https://smartlms-bay.vercel.app/certificate/${certificate.certificateId}`;

    const qrDataUrl = await QRCode.toDataURL(certPageUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#1a1a2e", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });

    const courseDesc = certificate.course.description
      ? certificate.course.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : "";
    const courseLevel = certificate.course.level || "All Levels";
    const courseTags = certificate.course.tags || [];
    const durationHours = certificate.course.duration
      ? Math.round(certificate.course.duration / 60)
      : null;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();

    doc.setFillColor(255, 253, 245);
    doc.rect(0, 0, pw, ph, "F");

    doc.setFillColor(45, 40, 30);
    doc.rect(0, 0, pw, 2.5, "F");
    doc.rect(0, ph - 2.5, pw, 2.5, "F");

    doc.setDrawColor(185, 165, 110);
    doc.setLineWidth(1);
    doc.roundedRect(8, 8, pw - 16, ph - 16, 2, 2, "S");

    doc.setDrawColor(210, 195, 150);
    doc.setLineWidth(0.25);
    doc.roundedRect(12, 12, pw - 24, ph - 24, 1.5, 1.5, "S");

    const cx = pw / 2;

    doc.setDrawColor(185, 165, 110);
    doc.setLineWidth(0.15);
    doc.line(cx - 10, 22, cx - 2.5, 22);
    doc.line(cx + 2.5, 22, cx + 10, 22);
    doc.setFillColor(185, 165, 110);
    doc.circle(cx, 22, 1.2, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(165, 145, 90);
    doc.text("SMARTLMS", cx, 18, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(55, 45, 30);
    doc.text("Certificate of Completion", cx, 32, { align: "center" });

    doc.setDrawColor(185, 165, 110);
    doc.setLineWidth(0.4);
    doc.line(cx - 55, 36, cx + 55, 36);

    doc.setFillColor(185, 165, 110);
    doc.circle(cx - 57, 36, 0.8, "F");
    doc.circle(cx + 57, 36, 0.8, "F");

    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(130, 120, 100);
    doc.text("This is to certify that", cx, 46, { align: "center" });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(32);
    doc.setTextColor(35, 30, 20);
    const studentName = certificate.user.name || "Student";
    doc.text(studentName, cx, 60, { align: "center" });

    const nameW = doc.getTextWidth(studentName);
    doc.setDrawColor(185, 165, 110);
    doc.setLineWidth(0.5);
    doc.line(cx - nameW / 2 - 15, 65, cx + nameW / 2 + 15, 65);

    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(130, 120, 100);
    doc.text("has successfully completed the course", cx, 74, {
      align: "center",
    });

    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.setTextColor(140, 115, 50);
    doc.text(certificate.course.title, cx, 85, { align: "center" });

    let detailY = 92;
    const detailParts: string[] = [];
    detailParts.push(`Level: ${courseLevel}`);
    if (durationHours) detailParts.push(`Duration: ${durationHours} hours`);
    if (courseTags.length > 0)
      detailParts.push(`Skills: ${courseTags.slice(0, 5).join(" | ")}`);

    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(130, 120, 100);
    doc.text(detailParts.join("   |   "), cx, detailY, { align: "center" });
    detailY += 5;

    if (courseDesc) {
      doc.setFont("times", "normal");
      doc.setFontSize(7);
      doc.setTextColor(140, 130, 110);
      const descLines = doc.splitTextToSize(courseDesc, pw - 100);
      doc.text(descLines.slice(0, 2), cx, detailY, { align: "center" });
      detailY += descLines.length > 1 ? 10 : 6;
    }

    doc.setDrawColor(210, 195, 150);
    doc.setLineWidth(0.2);
    doc.line(35, detailY, pw - 35, detailY);

    const sigY = detailY + 10;
    const drawSig = (x: number, label: string, value: string) => {
      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 70, 50);
      doc.text(value, x, sigY - 4, { align: "center" });
      doc.setDrawColor(180, 170, 150);
      doc.setLineWidth(0.2);
      doc.line(x - 22, sigY, x + 22, sigY);
      doc.setFont("times", "normal");
      doc.setFontSize(6);
      doc.setTextColor(160, 150, 130);
      doc.text(label.toUpperCase(), x, sigY + 4, { align: "center" });
    };

    drawSig(pw * 0.22, "Instructor", instructorName);
    drawSig(pw * 0.42, "Date of Issue", issuedDate);
    drawSig(pw * 0.62, "Certificate No.", certificate.certificateId);

    const qrX = pw - 50;
    const qrY = ph - 48;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 2, qrY - 2, 28, 28, 1, 1, "F");
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, 24, 24);
    doc.setFont("times", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(140, 130, 110);
    doc.text("Scan to view certificate", qrX + 12, qrY + 27, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(60, 130, 80);
    doc.text("VERIFIED", qrX + 12, ph - 17, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(160, 150, 130);
    doc.text(
      "View certificate at: smartlms-bay.vercel.app/certificate/" +
        certificate.certificateId,
      35,
      ph - 15
    );
    doc.text(
      "This certificate was issued by SmartLMS Platform",
      35,
      ph - 11
    );

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SmartLMS-Certificate-${certificate.certificateId}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
