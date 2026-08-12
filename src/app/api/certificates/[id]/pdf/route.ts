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
        course: { select: { title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!certificate) {
      return NextResponse.redirect(new URL("/dashboard/certificates", request.url));
    }

    if (session?.user?.id !== certificate.user.id) {
      return NextResponse.redirect(new URL("/dashboard/certificates", request.url));
    }

    const issuedDate = certificate.issuedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate - ${certificate.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f3f4f6; font-family: 'Inter', sans-serif; }
    .certificate {
      width: 800px; height: 560px; background: white; position: relative;
      border: 3px solid #6366f1; border-radius: 12px; overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    .corner { position: absolute; width: 80px; height: 80px; }
    .corner-tl { top: 0; left: 0; border-top: 4px solid #6366f1; border-left: 4px solid #6366f1; border-radius: 12px 0 0 0; }
    .corner-tr { top: 0; right: 0; border-top: 4px solid #6366f1; border-right: 4px solid #6366f1; border-radius: 0 12px 0 0; }
    .corner-bl { bottom: 0; left: 0; border-bottom: 4px solid #6366f1; border-left: 4px solid #6366f1; border-radius: 0 0 0 12px; }
    .corner-br { bottom: 0; right: 0; border-bottom: 4px solid #6366f1; border-right: 4px solid #6366f1; border-radius: 0 0 12px 0; }
    .content { text-align: center; padding: 50px 60px; position: relative; z-index: 1; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
    .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
    .logo-text { font-size: 22px; font-weight: 700; color: #1f2937; }
    .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 4px; color: #6366f1; margin-bottom: 20px; }
    .heading { font-family: 'Playfair Display', serif; font-size: 28px; color: #1f2937; margin-bottom: 15px; }
    .description { font-size: 13px; color: #6b7280; margin-bottom: 5px; }
    .name { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #1f2937; margin: 10px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; display: inline-block; }
    .course-text { font-size: 14px; color: #6b7280; margin-top: 10px; }
    .course-title { font-size: 18px; font-weight: 600; color: #6366f1; margin-top: 5px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .footer-col { text-align: center; }
    .footer-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; }
    .footer-value { font-size: 13px; color: #374151; margin-top: 3px; font-weight: 500; }
    .verify-id { font-size: 10px; color: #9ca3af; margin-top: 15px; }
    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 100px; font-weight: 700; color: rgba(99,102,241,0.03); pointer-events: none; z-index: 0; white-space: nowrap; }
    @media print { body { background: white; } .certificate { box-shadow: none; border: 2px solid #6366f1; } }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="watermark">CERTIFICATE</div>
    <div class="content">
      <div class="logo">
        <div class="logo-icon">🎓</div>
        <div class="logo-text">SmartLMS</div>
      </div>
      <div class="subtitle">Certificate of Completion</div>
      <div class="heading">This is to certify that</div>
      <div class="name">${certificate.user.name}</div>
      <div class="description">has successfully completed the course</div>
      <div class="course-title">${certificate.course.title}</div>
      <div class="footer">
        <div class="footer-col">
          <div class="footer-label">Date Issued</div>
          <div class="footer-value">${issuedDate}</div>
        </div>
        <div class="footer-col">
          <div class="footer-label">Certificate ID</div>
          <div class="footer-value">${certificate.certificateId}</div>
        </div>
        <div class="footer-col">
          <div class="footer-label">Status</div>
          <div class="footer-value">${certificate.status}</div>
        </div>
      </div>
      <div class="verify-id">Verify at: smartlms-bay.vercel.app/verify-certificate?id=${certificate.certificateId}</div>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/dashboard/certificates", request.url));
  }
}
