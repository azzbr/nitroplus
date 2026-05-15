import { Resend } from "resend";
import { COMPANY_INFO } from "@/lib/constants";
import type { QuotePayload } from "@/lib/quote-schema";

type SendResult = { ok: true } | { ok: false; error: string };

export async function sendQuoteEmail(payload: QuotePayload): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.INQUIRY_EMAIL || COMPANY_INFO.EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return { ok: false, error: "Email service not configured" };
  }

  const resend = new Resend(apiKey);

  const subject = `Quote inquiry — ${payload.vehicleYear} ${payload.vehicleMake} ${payload.vehicleModel}`;
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
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown email error",
    };
  }
}

function buildPlainText(p: QuotePayload): string {
  const sections: string[] = [
    "NITRO PLUS — QUOTE INQUIRY",
    "==========================",
    "",
    "CONTACT",
    "-------",
    `Name:  ${p.name}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    "",
    "VEHICLE",
    "-------",
    `Year:  ${p.vehicleYear}`,
    `Make:  ${p.vehicleMake}`,
    `Model: ${p.vehicleModel}`,
  ];

  if (p.vehicleVin) sections.push(`VIN:   ${p.vehicleVin}`);

  if (p.items.length > 0) {
    sections.push("", "ITEMS IN BASKET", "---------------");
    for (const item of p.items) {
      sections.push(`- ${item.name} (qty: ${item.quantity}) [${item.slug}]`);
    }
  }

  if (p.partsNeeded) {
    sections.push("", "PARTS NEEDED", "------------", p.partsNeeded);
  }

  if (p.notes) sections.push("", "NOTES", "-----", p.notes);

  return sections.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
