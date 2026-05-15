import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";

const PATHS = ["", "/about", "/careers", "/shop", "/contact", "/quote"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => {
      const isDefault = locale === routing.defaultLocale;
      const prefix = isDefault ? "" : `/${locale}`;
      const url = `${SITE_URL}${prefix}${path || (isDefault ? "/" : "")}`;
      return {
        url,
        lastModified: now,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => {
              const lPrefix = l === routing.defaultLocale ? "" : `/${l}`;
              return [
                l,
                `${SITE_URL}${lPrefix}${path || (l === routing.defaultLocale ? "/" : "")}`,
              ];
            })
          ),
        },
      };
    })
  );
}
