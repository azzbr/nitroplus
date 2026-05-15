"use client";

import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useHasHydrated, useQuoteBasket } from "@/lib/quote-store";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
};

export function QuoteBasketIcon({ locale }: Props) {
  const count = useQuoteBasket((s) => s.items.length);
  const hasHydrated = useHasHydrated();

  const showCount = hasHydrated && count > 0;

  return (
    <Link
      href="/quote"
      locale={locale}
      className={cn(
        "relative inline-flex items-center justify-center size-8",
        "rounded-lg hover:bg-muted transition-colors"
      )}
      aria-label="View inquiry basket"
    >
      <ShoppingBag className="h-5 w-5" />
      {showCount && (
        <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
