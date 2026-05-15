import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function Sourcing() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home.sourcing" });

  const types = [t("type1Title"), t("type2Title"), t("type3Title")];

  return (
    <section className="border-b border-border/50 bg-surface-elevated">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("eyebrow")}
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl">
              {t("headline")}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("body")}
            </p>
            <Button
              size="lg"
              className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/quote" locale={locale} className="inline-flex items-center">
                {t("ctaLabel")}
                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {types.map((title) => (
              <div
                key={title}
                className="flex items-center gap-4 border border-border/50 bg-background p-5"
              >
                <span aria-hidden="true" className="h-3 w-3 shrink-0 bg-primary" />
                <p className="font-display text-base font-bold uppercase tracking-wider text-foreground">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
