import { NextResponse } from "next/server";
import {
  quoteSchema,
  ATTACHMENT_ACCEPTED_MIME_SET,
  ATTACHMENT_MAX_FILE_BYTES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MAX_TOTAL_BYTES,
} from "@/lib/quote-schema";
import { sendQuoteEmail, type QuoteAttachment } from "@/lib/quote-email";
import { buildQuoteWhatsAppLink } from "@/lib/whatsapp";

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  // Validate + collect attachments
  const rawFiles = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (rawFiles.length > ATTACHMENT_MAX_FILES) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many attachments (max ${ATTACHMENT_MAX_FILES})`,
      },
      { status: 400 }
    );
  }

  let totalSize = 0;
  const attachments: QuoteAttachment[] = [];
  for (const f of rawFiles) {
    if (!ATTACHMENT_ACCEPTED_MIME_SET.has(f.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported file type: ${f.name || f.type}` },
        { status: 400 }
      );
    }
    if (f.size > ATTACHMENT_MAX_FILE_BYTES) {
      return NextResponse.json(
        { ok: false, error: `File too large: ${f.name} (max 5 MB)` },
        { status: 400 }
      );
    }
    totalSize += f.size;
    if (totalSize > ATTACHMENT_MAX_TOTAL_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Total attachment size exceeds 20 MB" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await f.arrayBuffer());
    attachments.push({
      filename: sanitizeFilename(f.name || "attachment"),
      content: buffer,
    });
  }

  // Parse items array (sent as JSON string in a single FormData field)
  let items: unknown = [];
  try {
    const raw = formData.get("items");
    if (typeof raw === "string" && raw.length > 0) {
      items = JSON.parse(raw);
    }
  } catch {
    items = [];
  }
  if (!Array.isArray(items)) items = [];

  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    vehicleMake: String(formData.get("vehicleMake") ?? ""),
    vehicleModel: String(formData.get("vehicleModel") ?? ""),
    vehicleYear: String(formData.get("vehicleYear") ?? ""),
    vehicleVin: String(formData.get("vehicleVin") ?? ""),
    partsNeeded: String(formData.get("partsNeeded") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    items,
  };

  const parsed = quoteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const emailResult = await sendQuoteEmail(parsed.data, attachments);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const whatsappLink = waNumber
    ? buildQuoteWhatsAppLink(waNumber, parsed.data)
    : "";

  if (!emailResult.ok && !whatsappLink) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not send inquiry — email service not configured and no WhatsApp fallback available.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: emailResult.ok,
    emailError: emailResult.ok ? null : emailResult.error,
    whatsappLink,
  });
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  return cleaned || "attachment";
}
