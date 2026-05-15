import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PART_CATEGORIES } from "@/lib/constants";

export async function PartCategories() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });

  return (
    <section className="border-b border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("partSectionSubtitle")}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("partSectionTitle")}
          </h2>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PART_CATEGORIES.map((part) => (
            <Link
              key={part.slug}
              href={`/shop?part=${part.slug}`}
              locale={locale}
              className="group relative flex items-center gap-3 border border-border/50 p-4 transition-colors hover:border-primary hover:bg-secondary/40"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 bg-primary transition-transform group-hover:scale-125"
              />
              <span className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                {t(`partLabels.${part.slug}`)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
