"use client";

import { MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  variant?: "floating" | "inline";
};

export function WhatsAppButton({
  variant = "floating",
}: WhatsAppButtonProps) {
  const waNumber = COMPANY_INFO.WHATSAPP_NUMBER;
  if (!waNumber) return null;

  const href = `https://wa.me/${waNumber}`;

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center",
          "rounded-full bg-green-500 text-white shadow-lg",
          "transition-transform hover:scale-110 active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        )}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap hover:bg-muted hover:text-foreground transition-colors"
    >
      <MessageCircle className="me-2 h-4 w-4" />
      WhatsApp
    </a>
  );
}