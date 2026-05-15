import type { QuotePayload } from "@/lib/quote-schema";

export function buildQuoteWhatsAppLink(
  whatsappNumber: string,
  payload: QuotePayload
): string {
  if (!whatsappNumber) return "";

  const lines: (string | null)[] = [
    "*Inquiry from Nitro Plus website*",
    "",
    `*Name:* ${payload.name}`,
    `*Email:* ${payload.email}`,
    `*Phone:* ${payload.phone}`,
  ];

  if (payload.vehicleMake && payload.vehicleModel && payload.vehicleYear) {
    lines.push(
      "",
      `*Vehicle:* ${payload.vehicleYear} ${payload.vehicleMake} ${payload.vehicleModel}`
    );
    if (payload.vehicleVin) lines.push(`*VIN:* ${payload.vehicleVin}`);
  }

  if (payload.items.length > 0) {
    lines.push("", "*Items in basket:*");
    for (const item of payload.items) {
      lines.push(`- ${item.name} (×${item.quantity})`);
    }
  }

  if (payload.partsNeeded) {
    lines.push("", "*Parts needed:*", payload.partsNeeded);
  }

  if (payload.notes) {
    lines.push("", `*Notes:* ${payload.notes}`);
  }

  const text = lines
    .filter((line): line is string => line !== null)
    .join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
