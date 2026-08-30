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
    const certPageUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://smartlms-bay.vercel.app"}/certificate/${certificate.certificateId}`;

    let qrMatrix: boolean[][] | null = null;
    try {
      const qr = QRCode.create(certPageUrl, { errorCorrectionLevel: "M" });
      const modules = qr.modules;
      qrMatrix = [];
      for (let row = 0; row < modules.size; row++) {
        const rowData: boolean[] = [];
        for (let col = 0; col < modules.size; col++) {
          rowData.push(modules.get(row, col) === 1);
        }
        qrMatrix.push(rowData);
      }
    } catch {
      qrMatrix = null;
    }

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
    const cx = pw / 2;

    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pw, ph, "F");

    // Blue outer border
    doc.setDrawColor(184, 212, 232);
    doc.setLineWidth(4);
    doc.rect(4, 4, pw - 8, ph - 8, "S");

    // Blue inner border
    doc.setDrawColor(184, 212, 232);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pw - 14, ph - 14, "S");

    // Top-left: SmartLMS logo + brand
    doc.setFillColor(0, 104, 200);
    doc.circle(18, 16, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text("SmartLMS", 18, 18, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 104, 200);
    doc.text("SmartLMS", 26, 18);

    // Top-right: CERTIFIED badge (shield shape)
    const badgeX = pw - 20;
    const badgeY = 12;
    doc.setFillColor(0, 86, 164);
    doc.triangle(badgeX, badgeY - 6, badgeX - 7, badgeY, badgeX + 7, badgeY, "F");
    doc.triangle(badgeX, badgeY + 6, badgeX - 7, badgeY, badgeX + 7, badgeY, "F");
    doc.setFillColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4);
    doc.setTextColor(0, 86, 164);
    doc.text("SmartLMS", badgeX, badgeY - 1, { align: "center" });
    doc.setFontSize(3.5);
    doc.text("CERTIFIED", badgeX, badgeY + 3, { align: "center" });

    // Title: "SmartLMS Presents"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 104, 200);
    doc.text("SmartLMS Presents", cx, 30, { align: "center" });

    // "CERTIFICATE" large
    doc.setFont("times", "bold");
    doc.setFontSize(36);
    doc.setTextColor(26, 26, 26);
    doc.text("CERTIFICATE", cx, 44, { align: "center" });

    // "OF COMPLETION"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    doc.text("OF COMPLETION", cx, 52, { align: "center" });

    // "This Certificate is Proudly Presented to"
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(68, 68, 68);
    doc.text("This Certificate is Proudly Presented to", cx, 62, { align: "center" });

    // Student name with blue underline
    const studentName = certificate.user.name || "Student";
    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.setTextColor(26, 26, 26);
    doc.text(studentName, cx, 76, { align: "center" });
    const nameW = doc.getTextWidth(studentName);
    doc.setDrawColor(0, 104, 200);
    doc.setLineWidth(0.5);
    doc.line(cx - nameW / 2 - 10, 80, cx + nameW / 2 + 10, 80);

    // "for successfully completing the course on"
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(68, 68, 68);
    doc.text("for successfully completing the course on", cx, 88, { align: "center" });

    // Course name
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(26, 26, 26);
    doc.text(certificate.course.title, cx, 97, { align: "center" });

    // Bottom section: Date - Badges - Signature
    const bottomY = ph - 30;

    // Date (left)
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);
    doc.text(issuedDate, pw * 0.22, bottomY, { align: "center" });
    doc.setDrawColor(51, 51, 51);
    doc.setLineWidth(0.3);
    doc.line(pw * 0.22 - 20, bottomY + 2, pw * 0.22 + 20, bottomY + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(102, 102, 102);
    doc.text("DATE", pw * 0.22, bottomY + 6, { align: "center" });

    // ISO badge (center-left)
    const badge1X = cx - 25;
    doc.setDrawColor(0, 104, 200);
    doc.setLineWidth(0.4);
    doc.circle(badge1X, bottomY - 2, 6, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4);
    doc.setTextColor(0, 104, 200);
    doc.text("CERTIFIED", badge1X, bottomY - 3.5, { align: "center" });
    doc.setFontSize(4.5);
    doc.text("COMPANY", badge1X, bottomY - 1, { align: "center" });
    doc.setFontSize(3.5);
    doc.text("ISO", badge1X, bottomY + 1.5, { align: "center" });

    // AICPA SOC badge (center)
    doc.setFillColor(0, 104, 200);
    doc.circle(cx, bottomY - 2, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4);
    doc.setTextColor(255, 255, 255);
    doc.text("AICPA", cx, bottomY - 3.5, { align: "center" });
    doc.setFontSize(4.5);
    doc.text("SOC", cx, bottomY - 1, { align: "center" });

    // ISO 37001 badge (center-right)
    const badge3X = cx + 25;
    doc.setDrawColor(0, 104, 200);
    doc.setLineWidth(0.4);
    doc.circle(badge3X, bottomY - 2, 6, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.5);
    doc.setTextColor(0, 104, 200);
    doc.text("ISO", badge3X, bottomY - 3.5, { align: "center" });
    doc.setFontSize(4);
    doc.text("37001", badge3X, bottomY - 1, { align: "center" });

    // Signature (right)
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);
    doc.text(instructorName, pw * 0.78, bottomY, { align: "center" });
    doc.setDrawColor(51, 51, 51);
    doc.setLineWidth(0.3);
    doc.line(pw * 0.78 - 20, bottomY + 2, pw * 0.78 + 20, bottomY + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(102, 102, 102);
    doc.text("FOUNDER AND CEO", pw * 0.78, bottomY + 6, { align: "center" });

    // QR Code (bottom center)
    const qrSize = 18;
    const qrX = cx - qrSize / 2;
    const qrY = ph - 25;

    if (qrMatrix) {
      const modules = qrMatrix.length;
      const cellSize = qrSize / modules;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, 1, 1, "F");
      doc.setDrawColor(184, 212, 232);
      doc.setLineWidth(0.3);
      doc.roundedRect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, 1, 1, "S");
      doc.setFillColor(26, 26, 46);
      for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
          if (qrMatrix[row][col]) {
            doc.rect(qrX + col * cellSize, qrY + row * cellSize, cellSize + 0.08, cellSize + 0.08, "F");
          }
        }
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.5);
    doc.setTextColor(0, 104, 200);
    doc.text("SCAN TO VERIFY", cx, qrY + qrSize + 4, { align: "center" });

    // Verified badge (bottom-right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(0, 166, 126);
    doc.text("VERIFIED", pw - 20, qrY + qrSize + 4, { align: "center" });

    // Certificate number (bottom-right above verified)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(102, 102, 102);
    doc.text("CERTIFICATE NO.", pw - 20, qrY - 4, { align: "center" });
    doc.setFont("courier", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(51, 51, 51);
    doc.text(certificate.certificateId, pw - 20, qrY + 1, { align: "center" });

    // Footer (bottom-left)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(153, 153, 153);
    doc.text(
      "View at: smartlms-bay.vercel.app/certificate/" + certificate.certificateId,
      14,
      ph - 12
    );
    doc.text("This certificate was issued by SmartLMS Platform", 14, ph - 9);

    const pdfArrayBuffer = doc.output("arraybuffer");
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

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
