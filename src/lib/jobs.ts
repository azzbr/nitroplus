export type JobType = "full-time" | "part-time" | "contract" | "internship";

export type Job = {
  slug: string;
  title: string;
  type: JobType;
  location: string;
  /** ISO date string, e.g. "2026-05-16" */
  postedAt: string;
  summary: string;
  responsibilities: ReadonlyArray<string>;
  requirements: ReadonlyArray<string>;
  niceToHave?: ReadonlyArray<string>;
  offers?: ReadonlyArray<string>;
};

// Add open roles here. Push the file and they go live on /careers.
// Template:
//   {
//     slug: "parts-specialist",
//     title: "Parts Specialist — Performance & 4×4",
//     type: "full-time",
//     location: "Manama, Bahrain (in-person)",
//     postedAt: "2026-05-16",
//     summary: "Short pitch — 1–2 sentences on what the role does and who it's for.",
//     responsibilities: [
//       "Source and price parts across performance and off-road verticals",
//       "Coordinate with suppliers in the GCC and beyond",
//     ],
//     requirements: [
//       "3+ years in the auto parts industry",
//       "Bilingual English / Arabic",
//     ],
//     niceToHave: ["Experience with American muscle or JDM platforms"],
//     offers: ["Competitive base + commission", "Direct access to deepperformance supply"],
//   },
export const JOBS: ReadonlyArray<Job> = [
  {
    slug: "outdoor-sales-executive-automotive",
    title: "Outdoor Sales Executive — Automotive Spare Parts & Wholesale",
    type: "full-time",
    location: "UAE (field-based)",
    postedAt: "2026-05-16",
    summary:
      "Drive new business and grow customer relationships in the UAE/GCC automotive spare parts and wholesale market. Visit garages, workshops, fleet companies, and wholesale buyers; promote our products and brands; hit sales targets.",
    responsibilities: [
      "Visit garages, workshops, spare parts shops, fleet companies, and wholesale buyers",
      "Develop new customers and expand market coverage across the UAE and GCC",
      "Promote company products, brands, and special offers",
      "Conduct regular market research and competitor analysis",
      "Achieve monthly sales targets and business growth objectives",
      "Follow up on payments and outstanding accounts when required",
    ],
    requirements: [
      "2–5 years experience in automotive spare parts sales or wholesale trading",
      "Strong knowledge of automotive spare parts and vehicle applications",
      "UAE driving license preferred",
      "Strong communication and negotiation skills",
      "Able to work independently and consistently hit sales targets",
      "Arabic, English, Hindi, or Urdu language skills are an advantage",
      "Familiarity with ERP systems and Microsoft Office",
    ],
    niceToHave: [
      "Direct experience in the GCC automotive market",
      "Background in heavy equipment parts",
      "Exposure to performance and racing parts",
      "Experience with lubricants and batteries categories",
      "Wholesale automotive trading background",
    ],
    offers: [
      "Competitive salary package",
      "Sales commission and incentives",
      "Company visa and medical insurance",
      "Career growth opportunities",
    ],
  },
];

export function getJobBySlug(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}
