import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AddToQuoteButton } from "@/components/shop/AddToQuoteButton";
import { getProductBySlug, PRODUCTS } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    const t = await getTranslations({ locale, namespace: "shop" });
    return { title: t("metaTitle") };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "shop" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="bg-background">
      <section>
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
          <Link
            href="/shop"
            locale={locale}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("backToShop")}
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden border border-border/50 bg-surface-elevated text-muted-foreground">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs uppercase tracking-wider">
                  {t("noImage")}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2">
                {product.tier && (
                  <span className="inline-flex items-center border border-primary/40 bg-primary/10 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-wider text-primary">
                    {t(`tier.${product.tier}` as "tier.oem")}
                  </span>
                )}
                {product.brand && (
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-5xl">
                {product.name}
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-2 border-y border-border/50 py-6">
                <p className="text-sm uppercase tracking-wider text-muted-foreground">
                  {tCommon("requestQuote")}
                </p>
                <p className="mt-2 leading-relaxed text-foreground">
                  {t("productQuoteCopy")}
                </p>
              </div>

              <AddToQuoteButton slug={product.slug} name={product.name} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
