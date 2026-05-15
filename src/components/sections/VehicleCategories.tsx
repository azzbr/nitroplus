import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const VEHICLE_GROUPS = [
  {
    titleKey: "vehicleGroupPerformance",
    slugs: ["american-muscle", "european-sport", "jdm-asian"],
  },
  {
    titleKey: "vehicleGroupLuxuryExotic",
    slugs: ["luxury-premium", "exotics-supercars"],
  },
  {
    titleKey: "vehicleGroupOffroadHeavy",
    slugs: ["4x4-offroad", "heavy-machinery"],
  },
  {
    titleKey: "vehicleGroupEverydayEv",
    slugs: ["standard-passenger", "ev-hybrid", "classic-vintage"],
  },
] as const;

export async function VehicleCategories() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });

  return (
    <section className="border-b border-border/50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("vehicleSectionSubtitle")}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("vehicleSectionTitle")}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VEHICLE_GROUPS.map((group) => (
            <div key={group.titleKey} className="border-s-2 border-primary ps-6">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                {t(group.titleKey)}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.slugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/shop?vehicle=${slug}`}
                      locale={locale}
                      className="text-sm leading-snug text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(`vehicleLabels.${slug}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
