import type { QuotePayload } from "@/lib/quote-schema";

export function buildQuoteWhatsAppLink(
  whatsappNumber: string,
  payload: QuotePayload
): string {
  if (!whatsappNumber) return "";

  const lines = [
    "*Inquiry from Nitro Plus website*",
    "",
    `*Name:* ${payload.name}`,
    `*Email:* ${payload.email}`,
    `*Phone:* ${payload.phone}`,
    "",
    `*Vehicle:* ${payload.vehicleYear} ${payload.vehicleMake} ${payload.vehicleModel}`,
    payload.vehicleVin ? `*VIN:* ${payload.vehicleVin}` : null,
    "",
    "*Parts needed:*",
    payload.partsNeeded,
    payload.notes ? "" : null,
    payload.notes ? `*Notes:* ${payload.notes}` : null,
  ].filter((line): line is string => line !== null);

  const text = lines.join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
