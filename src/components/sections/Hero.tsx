import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Industrial grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Diagonal accent stripe — mirrored under RTL */}
      <div
        aria-hidden="true"
        className="absolute end-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/4 bg-primary/10 rtl:skew-x-12 rtl:-translate-x-1/4"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="flex flex-col items-start gap-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("eyebrow")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-balance text-start font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {t("headlineLine1")}
            <span className="text-primary">.</span>
            <br />
            {t("headlineLine2")}
            <span className="text-primary">.</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("subheadline")}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 border-y border-border/50 py-6 md:gap-12">
            <div>
              <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {t("statPartsValue")}
              </p>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                {t("statPartsLabel")}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {t("statShippingValue")}
              </p>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                {t("statShippingLabel")}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {t("statCountriesValue")}
              </p>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                {t("statCountriesLabel")}
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/shop" locale={locale} className="inline-flex items-center">
                {t("ctaPrimary")}
                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-border px-8 py-6 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary"
            >
              <Link href="/quote" locale={locale} className="inline-flex items-center">
                <FileText className="me-2 h-5 w-5" />
                {t("ctaSecondary")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Vertical accent line */}
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 start-8 top-1/4 hidden w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent lg:block"
      />

      {/* Bottom accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
      />
    </section>
  );
}
