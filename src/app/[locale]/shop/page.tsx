import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ShopFilterBar } from "@/components/shop/ShopFilterBar";
import { ActiveFilterChips } from "@/components/shop/ActiveFilterChips";
import { Pagination } from "@/components/shop/Pagination";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  PRODUCTS,
  filterProducts,
  searchProducts,
  sortProducts,
  paginate,
  isValidPartSlug,
  isValidVehicleSlug,
  isValidSortKey,
  type SortKey,
} from "@/lib/products";

const PAGE_SIZE = 50;

type SearchParams = {
  vehicle?: string;
  part?: string;
  q?: string;
  sort?: string;
  page?: string;
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: t("metaTitle"),
    description: t("subheadline"),
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });
  const sp = await searchParams;

  const vehicle =
    sp.vehicle && isValidVehicleSlug(sp.vehicle) ? sp.vehicle : undefined;
  const part = sp.part && isValidPartSlug(sp.part) ? sp.part : undefined;
  const q = sp.q?.trim() || undefined;
  const sort: SortKey = sp.sort && isValidSortKey(sp.sort) ? sp.sort : "default";
  const pageRaw = parseInt(sp.page ?? "1", 10);
  const pageRequested = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const filter = { vehicle, part, q, sort };
  const isFiltered = Boolean(vehicle || part || q);

  let working = filterProducts(PRODUCTS, { vehicle, part });
  working = searchProducts(working, q);
  working = sortProducts(working, sort);
  const paged = paginate(working, pageRequested, PAGE_SIZE);

  const start = paged.total === 0 ? 0 : (paged.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(paged.page * PAGE_SIZE, paged.total);

  return (
    <div className="bg-background">
      {!isFiltered && (
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="shop-grid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#shop-grid)" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-primary" />
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t("eyebrow")}
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {t("headline")}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {t("subheadline")}
              </p>
            </div>
          </div>
        </section>
      )}

      <ShopFilterBar filter={filter} />

      <ActiveFilterChips filter={filter} />

      <section>
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
          <div className="mb-6 flex items-baseline justify-between">
            {isFiltered ? (
              <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
                {part
                  ? t(`partLabels.${part}` as "partLabels.wheels-tires")
                  : vehicle
                    ? t(`vehicleLabels.${vehicle}` as "vehicleLabels.4x4-offroad")
                    : t("searchResultsTitle")}
              </h1>
            ) : (
              <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                {t("allProductsHeading")}
              </p>
            )}
            <p className="text-sm tabular-nums text-muted-foreground">
              {paged.total === 0
                ? t("resultsEmpty")
                : t("resultsCount", { start, end, total: paged.total })}
            </p>
          </div>

          {paged.total === 0 ? (
            <div className="border border-border/50 p-8 text-center md:p-12">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("emptyStateBody")}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/shop"
                  locale={locale}
                  className="inline-flex items-center border border-border/50 bg-background px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary"
                >
                  {t("clearAllFilters")}
                </Link>
                <Button
                  size="lg"
                  className="rounded-none bg-primary px-6 py-5 font-display text-sm uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  <Link
                    href="/quote"
                    locale={locale}
                    className="inline-flex items-center"
                  >
                    <FileText className="me-2 h-4 w-4" />
                    {t("catalogCta")}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paged.items.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
              <Pagination
                filter={filter}
                page={paged.page}
                pages={paged.pages}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
