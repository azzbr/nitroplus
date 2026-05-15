import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  return {
    title: t("metaTitle"),
    description: t("subheadline"),
  };
}

export default async function CareersPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "careers" });

  const email = COMPANY_INFO.EMAIL;
  const whatsapp = COMPANY_INFO.WHATSAPP_NUMBER;

  const traits = [
    { title: t("trait1Title"), body: t("trait1Body") },
    { title: t("trait2Title"), body: t("trait2Body") },
    { title: t("trait3Title"), body: t("trait3Body") },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="careers-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#careers-grid)" />
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

      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("lookForTitle")}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {traits.map((trait) => (
              <div key={trait.title} className="border-s-2 border-primary ps-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {trait.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {trait.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("applyTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t("applyBody")}
          </p>

          {(email || whatsapp) && (
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {email && (
                <Button
                  size="lg"
                  className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  <a href={`mailto:${email}`} className="inline-flex items-center">
                    <Mail className="me-2 h-5 w-5" />
                    {t("applyEmailCta")}
                  </a>
                </Button>
              )}
              {whatsapp && (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-none border-border px-8 py-6 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary"
                >
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <MessageCircle className="me-2 h-5 w-5" />
                    {t("applyWhatsappCta")}
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
