import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AddToQuoteButton } from "./AddToQuoteButton";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  locale: string;
};

export async function ProductCard({ product, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "shop" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="group flex flex-col border border-border/50 bg-background transition-colors hover:border-primary">
      <Link
        href={`/shop/${product.slug}`}
        locale={locale}
        className="flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border/50 bg-surface-elevated text-muted-foreground"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="text-xs uppercase tracking-wider">
            {t("noImage")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {product.tier && (
            <span className="inline-flex items-center border border-primary/40 bg-primary/10 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-primary">
              {t(`tier.${product.tier}` as "tier.oem")}
            </span>
          )}
          {product.brand && (
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </span>
          )}
        </div>

        <Link href={`/shop/${product.slug}`} locale={locale} className="block">
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {tCommon("requestQuote")}
          </p>
          <AddToQuoteButton slug={product.slug} name={product.name} className="w-full" />
        </div>
      </div>
    </div>
  );
}
