import { getLocale, getTranslations } from "next-intl/server";
import { ChevronDown, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PART_CATEGORIES } from "@/lib/constants";
import { SortDropdown } from "@/components/shop/SortDropdown";
import type { SortKey } from "@/lib/products";

type Filter = {
  vehicle?: string;
  part?: string;
  q?: string;
  sort: SortKey;
};

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

function buildHref(base: Filter, key: keyof Filter, value: string | undefined): string {
  const params = new URLSearchParams();
  const next = { ...base, [key]: value, page: undefined } as Filter & { page?: string };
  if (next.vehicle) params.set("vehicle", next.vehicle);
  if (next.part) params.set("part", next.part);
  if (next.q) params.set("q", next.q);
  if (next.sort && next.sort !== "default") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

type Props = {
  filter: Filter;
};

export async function ShopFilterBar({ filter }: Props) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });

  const hiddenInputs = [
    filter.vehicle ? { name: "vehicle", value: filter.vehicle } : null,
    filter.part ? { name: "part", value: filter.part } : null,
    filter.sort !== "default" ? { name: "sort", value: filter.sort } : null,
  ].filter((x): x is { name: string; value: string } => x !== null);

  return (
    <div className="sticky top-16 z-30 border-y border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-3 lg:px-8">
        {/* Vehicle dropdown */}
        <details className="group relative">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 border border-border/50 bg-background px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary [&::-webkit-details-marker]:hidden">
            {t("filter.vehicle")}
            <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute start-0 top-full z-40 mt-2 w-80 border border-border bg-background p-5 shadow-2xl sm:w-96">
            <div className="space-y-5">
              {VEHICLE_GROUPS.map((group) => (
                <div key={group.titleKey}>
                  <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {t(group.titleKey)}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {group.slugs.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={buildHref(filter, "vehicle", slug)}
                          locale={locale}
                          className="block px-2 py-1 text-sm text-foreground transition-colors hover:bg-secondary"
                        >
                          {t(`vehicleLabels.${slug}` as "vehicleLabels.4x4-offroad")}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Part dropdown */}
        <details className="group relative">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 border border-border/50 bg-background px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary [&::-webkit-details-marker]:hidden">
            {t("filter.part")}
            <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute start-0 top-full z-40 mt-2 w-80 border border-border bg-background p-5 shadow-2xl sm:w-[28rem]">
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {PART_CATEGORIES.map((part) => (
                <li key={part.slug}>
                  <Link
                    href={buildHref(filter, "part", part.slug)}
                    locale={locale}
                    className="block px-2 py-1 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    {t(`partLabels.${part.slug}` as "partLabels.wheels-tires")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Search form (no JS — pure GET form) */}
        <form
          action=""
          method="get"
          className="flex flex-1 items-center gap-2 sm:min-w-[16rem] sm:max-w-md"
        >
          {hiddenInputs.map((h) => (
            <input key={h.name} type="hidden" name={h.name} value={h.value} />
          ))}
          <label htmlFor="shop-search" className="sr-only">
            {t("filter.search")}
          </label>
          <div className="relative flex flex-1 items-center">
            <Search
              className="pointer-events-none absolute start-3 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="shop-search"
              name="q"
              type="search"
              defaultValue={filter.q ?? ""}
              placeholder={t("filter.searchPlaceholder")}
              className="h-10 w-full border border-border/50 bg-background ps-9 pe-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </form>

        {/* Sort dropdown (client) */}
        <SortDropdown
          value={filter.sort}
          currentParams={{
            ...(filter.vehicle ? { vehicle: filter.vehicle } : {}),
            ...(filter.part ? { part: filter.part } : {}),
            ...(filter.q ? { q: filter.q } : {}),
          }}
        />
      </div>
    </div>
  );
}
