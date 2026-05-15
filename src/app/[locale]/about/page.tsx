import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("subheadline"),
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "about" });

  const whatBlocks = [
    { title: t("whatTradeTitle"), body: t("whatTradeBody") },
    { title: t("whatSourcingTitle"), body: t("whatSourcingBody") },
    { title: t("whatBreadthTitle"), body: t("whatBreadthBody") },
  ];

  const trustBlocks = [
    { title: t("trustExperienceTitle"), body: t("trustExperienceBody") },
    { title: t("trustLicenseTitle"), body: t("trustLicenseBody") },
    { title: t("trustReachTitle"), body: t("trustReachBody") },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
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

            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("subheadline")}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("storyTitle")}
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>{t("storyParagraph1")}</p>
            <p>{t("storyParagraph2")}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("whatWeDoTitle")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {whatBlocks.map((block) => (
              <div key={block.title} className="border-s-2 border-primary ps-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {block.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("trustTitle")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {trustBlocks.map((block) => (
              <div key={block.title} className="border border-border/50 p-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {block.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t("ctaBody")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/shop" locale={locale} className="inline-flex items-center">
                {t("ctaButtonPrimary")}
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
                {t("ctaButtonSecondary")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
