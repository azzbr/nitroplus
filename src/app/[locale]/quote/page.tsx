import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { QuoteBasketItems } from "@/components/shop/QuoteBasketItems";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });
  return {
    title: t("metaTitle"),
    description: t("subheadline"),
  };
}

export default async function QuotePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "quote" });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="quote-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#quote-grid)" />
          </svg>
        </div>

        <div
          aria-hidden="true"
          className="absolute end-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/4 bg-primary/10 rtl:skew-x-12 rtl:-translate-x-1/4"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="max-w-3xl text-balance text-start font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t("headline")}
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("subheadline")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20 lg:px-8">
          <QuoteBasketItems />
          <QuoteForm />
        </div>
      </section>
    </div>
  );
}
