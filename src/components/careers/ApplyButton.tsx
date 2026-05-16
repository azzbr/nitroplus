"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import {
  applySchema,
  applyFormDefaults,
  ACCEPTED_CV_MIME,
  MAX_CV_SIZE_BYTES,
  type ApplyPayload,
} from "@/lib/apply-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  job?: { slug: string; title: string };
  triggerLabel?: string;
  triggerVariant?: "primary" | "outline";
};

type SubmitState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export function ApplyButton({
  job,
  triggerLabel,
  triggerVariant = "primary",
}: Props) {
  const t = useTranslations("careers");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplyPayload>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      ...applyFormDefaults,
      jobSlug: job?.slug ?? "",
      jobTitle: job?.title ?? "",
    },
  });

  const translateError = (key: string | undefined) =>
    key ? t(`apply.errors.${key}` as "apply.errors.required") : undefined;

  const validateCv = (file: File | null): string | undefined => {
    if (!file) return "cvRequired";
    if (file.type !== ACCEPTED_CV_MIME) return "cvWrongType";
    if (file.size > MAX_CV_SIZE_BYTES) return "cvTooLarge";
    return undefined;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setCvFile(f);
    setCvError(validateCv(f));
  };

  const onSubmit = async (data: ApplyPayload) => {
    const err = validateCv(cvFile);
    if (err) {
      setCvError(err);
      return;
    }
    setState({ status: "idle" });

    const fd = new FormData();
    fd.set("name", data.name);
    fd.set("email", data.email);
    fd.set("phone", data.phone);
    fd.set("yearsExperience", data.yearsExperience);
    fd.set("jobSlug", data.jobSlug);
    fd.set("jobTitle", data.jobTitle);
    fd.set("coverNote", data.coverNote);
    fd.set("cv", cvFile!);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setState({
          status: "error",
          message: json.error ?? t("apply.errorGeneric"),
        });
        return;
      }
      setState({ status: "success" });
      reset();
      setCvFile(null);
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : t("apply.errorGeneric"),
      });
    }
  };

  const buttonClassName =
    triggerVariant === "primary"
      ? "rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
      : "rounded-none border-border px-8 py-6 font-display text-base uppercase tracking-wider text-foreground hover:bg-secondary";

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setState({ status: "idle" });
          setCvError(undefined);
        }
      }}
    >
      <SheetTrigger
        render={
          <Button
            size="lg"
            variant={triggerVariant === "outline" ? "outline" : "default"}
            className={buttonClassName}
          />
        }
      >
        <Send className="me-2 h-5 w-5" />
        {triggerLabel ?? t("apply.cta")}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full overflow-y-auto bg-background sm:max-w-md"
      >
        <div className="px-6 pt-12">
          <SheetTitle className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
            {job
              ? t("apply.titleForJob", { job: job.title })
              : t("apply.titleSpontaneous")}
          </SheetTitle>
          <SheetDescription className="mt-2 text-sm text-muted-foreground">
            {t("apply.subtitle")}
          </SheetDescription>
        </div>

        {state.status === "success" ? (
          <div className="m-6 mt-6 border border-primary/40 bg-primary/5 p-6 text-center">
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
              {t("apply.successTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("apply.successBody")}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 text-xs uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {t("apply.close")}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 p-6"
            noValidate
          >
            <input type="hidden" {...register("jobSlug")} />
            <input type="hidden" {...register("jobTitle")} />

            <div className="flex flex-col gap-2">
              <Label htmlFor="apply-name">{t("apply.name")}</Label>
              <Input
                id="apply-name"
                autoComplete="name"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name?.message && (
                <p className="text-xs text-destructive">
                  {translateError(errors.name.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apply-email">{t("apply.email")}</Label>
              <Input
                id="apply-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email?.message && (
                <p className="text-xs text-destructive">
                  {translateError(errors.email.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apply-phone">{t("apply.phone")}</Label>
              <Input
                id="apply-phone"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone?.message && (
                <p className="text-xs text-destructive">
                  {translateError(errors.phone.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apply-experience">
                {t("apply.yearsExperience")} ({t("apply.optional")})
              </Label>
              <Input
                id="apply-experience"
                placeholder={t("apply.yearsExperiencePlaceholder")}
                {...register("yearsExperience")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apply-cv">{t("apply.cv")}</Label>
              <input
                id="apply-cv"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                aria-invalid={Boolean(cvError)}
                className="block w-full cursor-pointer border border-border/50 bg-background text-sm text-foreground file:me-3 file:cursor-pointer file:border-0 file:bg-primary file:px-4 file:py-2 file:font-display file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">
                {t("apply.cvHint")}
              </p>
              {cvError && (
                <p className="text-xs text-destructive">
                  {translateError(cvError)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apply-cover">
                {t("apply.coverNote")} ({t("apply.optional")})
              </Label>
              <Textarea
                id="apply-cover"
                rows={5}
                placeholder={t("apply.coverNotePlaceholder")}
                {...register("coverNote")}
              />
            </div>

            {state.status === "error" && (
              <div
                role="alert"
                className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
              >
                {state.message}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full rounded-none bg-primary py-5 font-display text-sm uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? t("apply.submitting") : t("apply.submit")}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
