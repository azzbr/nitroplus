"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Props = {
  locale: string;
};

export function MobileNav({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const isRtl = locale === "ar";
  const side = isRtl ? "left" : "right";

  const links = [
    { href: "/", label: t("home") },
    { href: "/careers", label: t("careers") },
    { href: "/shop", label: t("shop") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("openMenu")}
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side={side}
        className="w-3/4 max-w-xs bg-background border-border"
      >
        <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
        <SheetDescription className="sr-only">
          {t("openMenu")}
        </SheetDescription>
        <nav className="mt-12 flex flex-col gap-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              locale={locale}
              onClick={() => setOpen(false)}
              className="px-4 py-3 font-display text-lg font-bold uppercase tracking-tight text-foreground transition-colors hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
