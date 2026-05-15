import { getLocale, getTranslations } from "next-intl/server";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { SortKey } from "@/lib/products";

type Filter = {
  vehicle?: string;
  part?: string;
  q?: string;
  sort: SortKey;
};

function buildClearHref(base: Filter, omit: keyof Filter): string {
  const params = new URLSearchParams();
  const keep = (k: keyof Filter, value: string | undefined) => {
    if (k === omit) return;
    if (k === "sort") {
      if (base.sort && base.sort !== "default") params.set("sort", base.sort);
      return;
    }
    if (value) params.set(k, value);
  };
  keep("vehicle", base.vehicle);
  keep("part", base.part);
  keep("q", base.q);
  keep("sort", undefined);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

type Props = {
  filter: Filter;
};

export async function ActiveFilterChips({ filter }: Props) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });

  const chips: { key: keyof Filter; label: string }[] = [];
  if (filter.vehicle) {
    chips.push({
      key: "vehicle",
      label: t(`vehicleLabels.${filter.vehicle}` as "vehicleLabels.4x4-offroad"),
    });
  }
  if (filter.part) {
    chips.push({
      key: "part",
      label: t(`partLabels.${filter.part}` as "partLabels.wheels-tires"),
    });
  }
  if (filter.q) {
    chips.push({ key: "q", label: `“${filter.q}”` });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 pt-6 lg:px-8">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={buildClearHref(filter, chip.key)}
          locale={locale}
          aria-label={t("removeFilter")}
          className="group inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:bg-primary/20"
        >
          {chip.label}
          <X className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-foreground" />
        </Link>
      ))}
      {chips.length > 1 && (
        <Link
          href="/shop"
          locale={locale}
          className="text-xs uppercase tracking-wider text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("clearAllFilters")}
        </Link>
      )}
    </div>
  );
}
