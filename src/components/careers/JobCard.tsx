import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Job } from "@/lib/jobs";

type Props = {
  job: Job;
  locale: string;
  typeLabel: string;
  postedLabel: string;
  viewRoleLabel: string;
};

export function JobCard({ job, locale, typeLabel, postedLabel, viewRoleLabel }: Props) {
  return (
    <Link
      href={`/careers/${job.slug}`}
      locale={locale}
      className="group flex flex-col gap-4 border border-border/50 bg-background p-6 transition-colors hover:border-primary"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center border border-primary/40 bg-primary/10 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-primary">
          {typeLabel}
        </span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {job.location}
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">{postedLabel}</span>
      </div>

      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
        {job.title}
      </h3>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {job.summary}
      </p>

      <div className="mt-auto inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-primary">
        {viewRoleLabel}
        <ArrowRight className="h-3 w-3 rtl:rotate-180" />
      </div>
    </Link>
  );
}
