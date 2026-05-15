import { COMPANY_INFO, SITE_URL } from "@/lib/constants";

export function StructuredData() {
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: COMPANY_INFO.NAME,
    alternateName: "نيترو بلس للتجارة",
    url: SITE_URL,
    description:
      "Auto parts trading — OEM, performance, and aftermarket. 4×4, muscle, luxury, exotic, JDM, heavy machinery, classics, EV, and standard passenger vehicles.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
    },
    areaServed: [
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Saudi Arabia" },
      { "@type": "Country", name: "Kuwait" },
      { "@type": "Country", name: "Bahrain" },
      { "@type": "Country", name: "Qatar" },
      { "@type": "Country", name: "Oman" },
    ],
  };

  if (COMPANY_INFO.EMAIL) business.email = COMPANY_INFO.EMAIL;
  if (COMPANY_INFO.PHONE) business.telephone = COMPANY_INFO.PHONE;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_INFO.NAME,
    alternateName: "نيترو بلس للتجارة",
    url: SITE_URL,
    description: COMPANY_INFO.LICENSE,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
    </>
  );
}
