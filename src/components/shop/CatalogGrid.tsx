import { getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { PRODUCTS, filterProducts } from "@/lib/products";

type Props = {
  locale: string;
  filter: { vehicle?: string; part?: string };
};

export async function CatalogGrid({ locale, filter }: Props) {
  const t = await getTranslations({ locale, namespace: "shop" });
  const products = filterProducts(PRODUCTS, filter);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("catalogSubtitle")}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("catalogTitle")}
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="mt-12 border border-border/50 p-8 text-center md:p-12">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("catalogPlaceholder")}
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/quote" locale={locale} className="inline-flex items-center">
                  <FileText className="me-2 h-5 w-5" />
                  {t("catalogCta")}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
