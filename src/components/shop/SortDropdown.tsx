"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { SortKey } from "@/lib/products";

type Props = {
  value: SortKey;
  currentParams: Record<string, string>;
};

export function SortDropdown({ value, currentParams }: Props) {
  const t = useTranslations("shop");
  const router = useRouter();

  return (
    <label className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
      <span className="hidden sm:inline">{t("filter.sort")}:</span>
      <select
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(currentParams);
          if (e.target.value !== "default") {
            params.set("sort", e.target.value);
          } else {
            params.delete("sort");
          }
          params.delete("page");
          const qs = params.toString();
          router.push(qs ? `/shop?${qs}` : "/shop");
        }}
        className="h-10 border border-border/50 bg-background px-3 font-display text-xs font-bold uppercase tracking-wider text-foreground focus:border-primary focus:outline-none"
      >
        <option value="default">{t("sort.default")}</option>
        <option value="name-asc">{t("sort.nameAsc")}</option>
        <option value="name-desc">{t("sort.nameDesc")}</option>
      </select>
    </label>
  );
}
