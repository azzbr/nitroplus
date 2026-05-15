import { getLocale, getTranslations } from "next-intl/server";

export async function Experience() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home.experience" });

  const blocks = [
    { title: t("depthTitle"), body: t("depthBody") },
    { title: t("tiersTitle"), body: t("tiersBody") },
    { title: t("sourcingTitle"), body: t("sourcingBody") },
  ];

  return (
    <section className="border-b border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("headline")}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("subheadline")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.title} className="border-s-2 border-primary ps-6">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {block.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
