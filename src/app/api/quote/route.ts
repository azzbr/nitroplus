import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/quote-schema";
import { sendQuoteEmail } from "@/lib/quote-email";
import { buildQuoteWhatsAppLink } from "@/lib/whatsapp";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const emailResult = await sendQuoteEmail(parsed.data);

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
