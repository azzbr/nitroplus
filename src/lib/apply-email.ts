import { Resend } from "resend";
import { COMPANY_INFO } from "@/lib/constants";
import type { ApplyPayload } from "@/lib/apply-schema";

type SendResult = { ok: true } | { ok: false; error: string };

type CvAttachment = {
  filename: string;
  content: Buffer;
};

export async function sendApplicationEmail(
  payload: ApplyPayload,
  cv: CvAttachment
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail =
    process.env.CAREERS_EMAIL ||
    process.env.INQUIRY_EMAIL ||
    COMPANY_INFO.EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return { ok: false, error: "Email service not configured" };
  }

  const resend = new Resend(apiKey);

  const subject = payload.jobSlug
    ? `Application — ${payload.jobTitle || payload.jobSlug} — ${payload.name}`
    : `Spontaneous application — ${payload.name}`;

  const text = buildPlainText(payload);
  const html = `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; white-space: pre-wrap; line-height: 1.5; font-size: 14px;">${escapeHtml(text)}</pre>`;

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: payload.email,
      subject,
      text,
      html,
      attachments: [{ filename: cv.filename, content: cv.content }],
    });

    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}

function buildPlainText(p: ApplyPayload): string {
  const sections: string[] = [
    "NITRO PLUS — APPLICATION",
    "========================",
    "",
    p.jobSlug
      ? `ROLE: ${p.jobTitle || p.jobSlug}`
      : "ROLE: Spontaneous application",
    "",
    "APPLICANT",
    "---------",
    `Name:        ${p.name}`,
    `Email:       ${p.email}`,
    `Phone:       ${p.phone}`,
  ];

  if (p.yearsExperience) sections.push(`Experience:  ${p.yearsExperience}`);

  if (p.coverNote) {
    sections.push("", "COVER NOTE", "----------", p.coverNote);
  }

  sections.push("", "CV is attached as a PDF.");

  return sections.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
