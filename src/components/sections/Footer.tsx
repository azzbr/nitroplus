import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/Logo";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { VEHICLE_CATEGORIES, PART_CATEGORIES, COMPANY_INFO } from "@/lib/constants";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Company info */}
          <div className="space-y-4">
            <Logo locale={locale} />
            <p className="text-sm text-text-muted">{t("description")}</p>
            <p className="text-xs text-text-muted">
              {COMPANY_INFO.LICENSE}
            </p>
            <WhatsAppButton variant="inline" />
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("quickLinks")}</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: tNav("home") },
                { href: "/about", label: tNav("about") },
                { href: "/shop", label: tNav("shop") },
                { href: "/quote", label: tNav("quote") },
                { href: "/contact", label: tNav("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    locale={locale}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicle categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("vehicleCategories")}</h3>
            <ul className="space-y-3">
              {VEHICLE_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    locale={locale}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Part categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("partCategories")}</h3>
            <ul className="space-y-3">
              {PART_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/parts/${cat.slug}`}
                    locale={locale}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} {t("companyName")}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}