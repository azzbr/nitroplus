"use client";

import { useTranslations } from "next-intl";
import { Minus, Plus, X } from "lucide-react";
import { useHasHydrated, useQuoteBasket } from "@/lib/quote-store";

export function QuoteBasketItems() {
  const t = useTranslations("quote");
  const items = useQuoteBasket((s) => s.items);
  const removeItem = useQuoteBasket((s) => s.removeItem);
  const updateQuantity = useQuoteBasket((s) => s.updateQuantity);
  const hasHydrated = useHasHydrated();

  if (!hasHydrated || items.length === 0) return null;

  return (
    <div className="mb-10 border border-primary/40 bg-primary/5 p-6">
      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
        {t("basketTitle")}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("basketSubtitle", { count: items.length })}
      </p>

      <ul className="mt-6 divide-y divide-border/50">
        {items.map((item) => (
          <li key={item.slug} className="flex items-center gap-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-bold uppercase tracking-tight text-foreground">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center border border-border/50 transition-colors hover:border-primary disabled:opacity-40 disabled:hover:border-border/50"
                aria-label={t("decreaseQty")}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center font-display text-sm font-bold tabular-nums text-foreground">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                disabled={item.quantity >= 99}
                className="flex h-8 w-8 items-center justify-center border border-border/50 transition-colors hover:border-primary disabled:opacity-40 disabled:hover:border-border/50"
                aria-label={t("increaseQty")}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.slug)}
              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
              aria-label={t("removeItem")}
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
