"use client";

import { useTranslations } from "next-intl";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHasHydrated, useQuoteBasket } from "@/lib/quote-store";

type Props = {
  slug: string;
  name: string;
  className?: string;
};

export function AddToQuoteButton({ slug, name, className }: Props) {
  const t = useTranslations("common");
  const addItem = useQuoteBasket((s) => s.addItem);
  const inBasket = useQuoteBasket((s) =>
    s.items.some((i) => i.slug === slug)
  );
  const hasHydrated = useHasHydrated();

  const showInBasket = hasHydrated && inBasket;

  return (
    <Button
      type="button"
      onClick={() => addItem({ slug, name })}
      size="lg"
      className={`rounded-none bg-primary px-6 py-5 font-display text-sm uppercase tracking-wider text-primary-foreground hover:bg-primary/90 ${className ?? ""}`}
    >
      {showInBasket ? (
        <>
          <Check className="me-2 h-4 w-4" />
          {t("inQuote")}
        </>
      ) : (
        <>
          <Plus className="me-2 h-4 w-4" />
          {t("addToQuote")}
        </>
      )}
    </Button>
  );
}
