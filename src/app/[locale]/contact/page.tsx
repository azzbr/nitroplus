import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Mail, Phone, MessageCircle, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: t("subheadline"),
  };
}

type ContactMethod = {
  key: "email" | "phone" | "whatsapp";
  label: string;
  value: string;
  href: string;
  external: boolean;
};

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "contact" });

  const methods: ContactMethod[] = [];
  if (COMPANY_INFO.EMAIL) {
    methods.push({
      key: "email",
      label: t("emailLabel"),
      value: COMPANY_INFO.EMAIL,
      href: `mailto:${COMPANY_INFO.EMAIL}`,
      external: false,
    });
  }
  if (COMPANY_INFO.PHONE) {
    methods.push({
      key: "phone",
      label: t("phoneLabel"),
      value: COMPANY_INFO.PHONE,
      href: `tel:${COMPANY_INFO.PHONE.replace(/\s+/g, "")}`,
      external: false,
    });
  }
  if (COMPANY_INFO.WHATSAPP_NUMBER) {
    methods.push({
      key: "whatsapp",
      label: t("whatsappLabel"),
      value: `+${COMPANY_INFO.WHATSAPP_NUMBER}`,
      href: `https://wa.me/${COMPANY_INFO.WHATSAPP_NUMBER}`,
      external: true,
    });
  }

  const iconFor = (key: ContactMethod["key"]) =>
    key === "email" ? Mail : key === "phone" ? Phone : MessageCircle;

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contact-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
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
            {t("methodsTitle")}
          </h2>

          {methods.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map((method) => {
                const Icon = iconFor(method.key);
                return (
                  <a
                    key={method.key}
                    href={method.href}
                    {...(method.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-start gap-4 border border-border/50 p-6 transition-colors hover:border-primary hover:bg-secondary/40"
                  >
                    <Icon
                      className="h-6 w-6 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {method.label}
                      </p>
                      <p className="mt-1 break-all text-base text-foreground">
                        {method.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("noMethodsCopy")}
            </p>
          )}

          <div className="mt-12 border-s-2 border-primary ps-6">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
              {t("licenseTitle")}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t("licenseBody")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("quoteCtaTitle")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t("quoteCtaBody")}
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/quote" locale={locale} className="inline-flex items-center">
                <FileText className="me-2 h-5 w-5" />
                {t("quoteCtaButton")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
