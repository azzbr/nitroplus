import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="flex flex-col">
      {/* Hero section — placeholder shell */}
      <section className="relative flex min-h-[70vh] items-center justify-center bg-surface-elevated">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg">
              <Link href="/quote" locale={locale}>
                {t("heroCta")}
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/categories" locale={locale}>
                {t("heroSecondary")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}