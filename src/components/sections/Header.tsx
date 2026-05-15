import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/shared/Logo";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { QuoteBasketIcon } from "@/components/shared/QuoteBasketIcon";
import { getLocale } from "next-intl/server";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "nav" });

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/careers", label: t("careers") },
    { href: "/shop", label: t("shop") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Logo locale={locale} />
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                locale={locale}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <QuoteBasketIcon count={0} locale={locale} />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}