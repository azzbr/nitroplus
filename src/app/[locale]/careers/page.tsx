import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { ApplyButton } from "@/components/careers/ApplyButton";
import { JobCard } from "@/components/careers/JobCard";
import { JOBS } from "@/lib/jobs";
import { COMPANY_INFO } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  return {
    title: t("metaTitle"),
    description: t("subheadline"),
  };
}

function postedLabel(
  postedAt: string,
  t: (key: string, values?: Record<string, string | number>) => string
): string {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(postedAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  if (days === 0) return t("postedToday");
  if (days === 1) return t("postedYesterday");
  return t("postedDaysAgo", { days });
}

export default async function CareersPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "careers" });

  const traits = [
    { title: t("trait1Title"), body: t("trait1Body") },
    { title: t("trait2Title"), body: t("trait2Body") },
    { title: t("trait3Title"), body: t("trait3Body") },
  ];

  const referralEmail = COMPANY_INFO.CAREERS_INBOX;
  const hasOpenRoles = JOBS.length > 0;

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="careers-grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#careers-grid)" />
          </svg>
        </div>

        <div
          aria-hidden="true"
          className="absolute end-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/4 bg-primary/10 rtl:skew-x-12 rtl:-translate-x-1/4"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="max-w-3xl text-balance text-start font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {t("headline")}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("subheadline")}
            </p>

            <div className="mt-2">
              <ApplyButton triggerLabel={t("apply.ctaSpontaneous")} />
            </div>
          </div>
        </div>
      </section>

      {hasOpenRoles && (
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-primary" />
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t("openPositionsEyebrow")}
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
                {t("openPositionsTitle")}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {JOBS.map((job) => (
                <JobCard
                  key={job.slug}
                  job={job}
                  locale={locale}
                  typeLabel={t(`jobType.${job.type}` as "jobType.full-time")}
                  postedLabel={postedLabel(job.postedAt, t)}
                  viewRoleLabel={t("viewRole")}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            {t("lookForTitle")}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {traits.map((trait) => (
              <div key={trait.title} className="border-s-2 border-primary ps-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {trait.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {trait.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16 lg:px-8">
          <div className="flex items-start gap-4">
            <Mail
              className="mt-1 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                {t("referralTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("referralBody")}{" "}
                <a
                  href={`mailto:${referralEmail}`}
                  className="break-all font-medium text-foreground underline underline-offset-4 hover:text-primary"
                >
                  {referralEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
