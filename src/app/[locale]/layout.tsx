import {
  Geist,
  Geist_Mono,
  Oswald,
  IBM_Plex_Sans_Arabic,
  Cairo,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { StructuredData } from "@/components/shared/StructuredData";
import { SITE_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic-body",
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
});

const cairoArabic = Cairo({
  variable: "--font-arabic-display",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["arabic"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const siteTitle = t("siteTitle");
  const isDefault = locale === routing.defaultLocale;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s — ${siteTitle}`,
      default: siteTitle,
    },
    description: t("siteDescription"),
    alternates: {
      canonical: isDefault ? "/" : `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? "/" : `/${l}`,
        ])
      ),
    },
    openGraph: {
      type: "website",
      siteName: siteTitle,
      title: siteTitle,
      description: t("siteDescription"),
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      url: isDefault ? SITE_URL : `${SITE_URL}/${locale}`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${ibmPlexArabic.variable} ${cairoArabic.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <StructuredData />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
