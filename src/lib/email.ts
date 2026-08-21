import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn("[Email] SMTP not configured, skipping email send");
      return false;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@smartlms.com",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

function baseTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
              <tr>
                <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">SmartLMS</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <h2 style="color:#1f2937;margin:0 0 16px;font-size:20px;">${title}</h2>
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="padding:20px 40px;background-color:#f9fafb;text-align:center;">
                  <p style="color:#9ca3af;font-size:12px;margin:0;">SmartLMS Learning Platform</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function enrollmentConfirmation(
  user: { name: string | null; email: string },
  course: { title: string; slug: string; category?: string | null; level?: string }
): string {
  const displayName = user.name || "Learner";
  const categoryText = course.category ? ` in ${course.category}` : "";
  const levelText = course.level ? ` &mdash; ${course.level} level` : "";

  const content = `
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
      Hi <strong>${displayName}</strong>,
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
      You've been successfully enrolled in <strong>${course.title}</strong>${categoryText}${levelText}.
    </p>
    <div style="background-color:#eef2ff;border-left:4px solid #4f46e5;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="color:#4338ca;font-size:14px;margin:0;">
        You can now access all lessons, quizzes, and materials in this course.
      </p>
    </div>
    <p style="text-align:center;margin:0 0 24px;">
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/courses/${course.slug}"
         style="background-color:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;display:inline-block;font-size:15px;">
        Start Learning
      </a>
    </p>
    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0;">
      Happy learning!<br/>The SmartLMS Team
    </p>
  `;

  return baseTemplate("Enrollment Confirmed!", content);
}

export function quizResult(
  user: { name: string | null; email: string },
  quiz: { title: string; passingScore: number; courseId?: string | null },
  score: number,
  passed: boolean
): string {
  const displayName = user.name || "Learner";
  const statusColor = passed ? "#059669" : "#dc2626";
  const statusText = passed ? "Congratulations! You passed!" : "Keep practicing — you'll get it next time!";
  const emoji = passed ? "🎉" : "📚";

  const content = `
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
      Hi <strong>${displayName}</strong>,
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
      You completed the quiz <strong>${quiz.title}</strong>.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      <div style="display:inline-block;background-color:${passed ? "#ecfdf5" : "#fef2f2"};border:2px solid ${statusColor};border-radius:12px;padding:24px 40px;">
        <p style="font-size:36px;margin:0 0 8px;">${emoji}</p>
        <p style="font-size:32px;font-weight:700;color:${statusColor};margin:0 0 4px;">${Math.round(score)}%</p>
        <p style="font-size:14px;color:${statusColor};margin:0;font-weight:600;">${statusText}</p>
      </div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#f9fafb;padding:12px 16px;border-radius:8px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#6b7280;font-size:14px;padding:4px 0;">Your Score</td>
              <td style="color:#1f2937;font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${Math.round(score)}%</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:14px;padding:4px 0;">Passing Score</td>
              <td style="color:#1f2937;font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${quiz.passingScore}%</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:14px;padding:4px 0;">Result</td>
              <td style="color:${statusColor};font-size:14px;font-weight:600;text-align:right;padding:4px 0;">${passed ? "PASSED" : "FAILED"}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0;">
      — The SmartLMS Team
    </p>
  `;

  return baseTemplate("Quiz Results", content);
}

export function certificateIssued(
  user: { name: string | null; email: string },
  course: { title: string; slug: string }
): string {
  const displayName = user.name || "Learner";

  const content = `
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
      Hi <strong>${displayName}</strong>,
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 20px;">
      Congratulations on completing <strong>${course.title}</strong>! Your certificate has been issued.
    </p>
    <div style="background-color:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="color:#92400e;font-size:14px;margin:0;">
        🏆 This certificate verifies your successful completion of the course and the skills you've acquired.
      </p>
    </div>
    <p style="text-align:center;margin:0 0 24px;">
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/certificate"
         style="background-color:#f59e0b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;display:inline-block;font-size:15px;">
        View Certificate
      </a>
    </p>
    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0;">
      Keep up the great work!<br/>The SmartLMS Team
    </p>
  `;

  return baseTemplate("Certificate Issued!", content);
}
