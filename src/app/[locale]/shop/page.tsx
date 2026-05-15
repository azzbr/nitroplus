import { getLocale, getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { VehicleCategories } from "@/components/sections/VehicleCategories";
import { PartCategories } from "@/components/sections/PartCategories";

export default async function ShopPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="shop-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shop-grid)" />
          </svg>
        </div>

        <div
          aria-hidden="true"
          className="absolute end-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/4 bg-primary/10 rtl:skew-x-12 rtl:-translate-x-1/4"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col items-start gap-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="max-w-3xl text-balance text-start font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {t("headline")}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("subheadline")}
            </p>
          </div>
        </div>
      </section>

      <VehicleCategories />
      <PartCategories />

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("catalogTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t("catalogPlaceholder")}
          </p>
          <div className="mt-10 flex justify-center">
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
      </section>
    </div>
  );
}
