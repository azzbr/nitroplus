import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function InquiryCta() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home.inquiryCta" });

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="inquiry-cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#inquiry-cta-grid)" />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="absolute end-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/4 bg-primary/10 rtl:skew-x-12 rtl:-translate-x-1/4"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:py-28 lg:px-8">
        <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {t("headline")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t("subheadline")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/quote" locale={locale} className="inline-flex items-center">
              <FileText className="me-2 h-5 w-5" />
              {t("primaryCta")}
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-none border-border px-8 py-6 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary"
          >
            <Link href="/shop" locale={locale} className="inline-flex items-center">
              {t("secondaryCta")}
              <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
