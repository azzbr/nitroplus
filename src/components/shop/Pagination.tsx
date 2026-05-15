import { getLocale, getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { SortKey } from "@/lib/products";

type Filter = {
  vehicle?: string;
  part?: string;
  q?: string;
  sort: SortKey;
};

function pageHref(base: Filter, page: number): string {
  const params = new URLSearchParams();
  if (base.vehicle) params.set("vehicle", base.vehicle);
  if (base.part) params.set("part", base.part);
  if (base.q) params.set("q", base.q);
  if (base.sort && base.sort !== "default") params.set("sort", base.sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, current, current - 1, current + 1]);
  const pages = Array.from(set)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i] as number;
    result.push(p);
    const next = pages[i + 1];
    if (typeof next === "number" && next - p > 1) result.push("…");
  }
  return result;
}

type Props = {
  filter: Filter;
  page: number;
  pages: number;
};

export async function Pagination({ filter, page, pages }: Props) {
  if (pages <= 1) return null;

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "shop" });

  const range = buildPageRange(page, pages);

  return (
    <nav
      aria-label={t("pagination.label")}
      className="mt-12 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={pageHref(filter, page - 1)}
          locale={locale}
          className="inline-flex h-10 items-center gap-1 border border-border/50 bg-background px-3 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t("pagination.prev")}</span>
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1 border border-border/30 bg-background px-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-50">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t("pagination.prev")}</span>
        </span>
      )}

      {range.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className="px-2 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className="inline-flex h-10 w-10 items-center justify-center border border-primary bg-primary font-display text-xs font-bold uppercase tracking-wider text-primary-foreground"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(filter, p)}
            locale={locale}
            className="inline-flex h-10 w-10 items-center justify-center border border-border/50 bg-background font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary"
          >
            {p}
          </Link>
        )
      )}

      {page < pages ? (
        <Link
          href={pageHref(filter, page + 1)}
          locale={locale}
          className="inline-flex h-10 items-center gap-1 border border-border/50 bg-background px-3 font-display text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary"
        >
          <span className="hidden sm:inline">{t("pagination.next")}</span>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span className="inline-flex h-10 items-center gap-1 border border-border/30 bg-background px-3 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-50">
          <span className="hidden sm:inline">{t("pagination.next")}</span>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      )}
    </nav>
  );
}
