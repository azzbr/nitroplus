import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ApplyButton } from "@/components/careers/ApplyButton";
import { JOBS, getJobBySlug } from "@/lib/jobs";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) {
    const t = await getTranslations({ locale, namespace: "careers" });
    return { title: t("metaTitle") };
  }
  return {
    title: job.title,
    description: job.summary,
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

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const job = getJobBySlug(slug);

  if (!job) notFound();

  const t = await getTranslations({ locale, namespace: "careers" });

  return (
    <div className="bg-background">
      <section>
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
          <Link
            href="/careers"
            locale={locale}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("backToCareers")}
          </Link>

          <header className="mt-8 flex flex-col gap-4 border-b border-border/50 pb-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center border border-primary/40 bg-primary/10 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-primary">
                {t(`jobType.${job.type}` as "jobType.full-time")}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {job.location}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {postedLabel(job.postedAt, t)}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-5xl">
              {job.title}
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground">
              {job.summary}
            </p>

            <div className="mt-4">
              <ApplyButton
                job={{ slug: job.slug, title: job.title }}
                triggerLabel={t("apply.ctaForJob")}
              />
            </div>
          </header>

          <Section
            title={t("responsibilitiesTitle")}
            items={job.responsibilities}
          />
          <Section
            title={t("requirementsTitle")}
            items={job.requirements}
          />
          {job.niceToHave && job.niceToHave.length > 0 && (
            <Section title={t("niceToHaveTitle")} items={job.niceToHave} />
          )}
          {job.offers && job.offers.length > 0 && (
            <Section title={t("offersTitle")} items={job.offers} />
          )}

          <div className="mt-12 border-t border-border/50 pt-8">
            <p className="text-base text-muted-foreground">
              {t("readyToApply")}
            </p>
            <div className="mt-4">
              <ApplyButton
                job={{ slug: job.slug, title: job.title }}
                triggerLabel={t("apply.ctaForJob")}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<string>;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="text-base leading-relaxed text-foreground">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
