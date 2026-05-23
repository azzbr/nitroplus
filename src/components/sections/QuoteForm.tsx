"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FileText, MessageCircle, Paperclip, X } from "lucide-react";
import {
  quoteSchema,
  quoteFormDefaults,
  ATTACHMENT_ACCEPTED_TYPES,
  ATTACHMENT_MAX_FILE_BYTES,
  ATTACHMENT_MAX_FILES,
  ATTACHMENT_MAX_TOTAL_BYTES,
  type QuotePayload,
} from "@/lib/quote-schema";
import { useHasHydrated, useQuoteBasket } from "@/lib/quote-store";
import {
  VEHICLE_MAKES,
  VEHICLE_YEARS,
  getMakeByLabel,
} from "@/lib/vehicles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type SubmitState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; emailSent: boolean; whatsappLink: string };

export function QuoteForm() {
  const t = useTranslations("quote");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const basketItems = useQuoteBasket((s) => s.items);
  const clearBasket = useQuoteBasket((s) => s.clear);
  const hasHydrated = useHasHydrated();
  const hasItems = hasHydrated && basketItems.length > 0;

  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuotePayload>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteFormDefaults,
  });

  const currentMake = useWatch({ control, name: "vehicleMake" });
  const modelsForMake = getMakeByLabel(currentMake)?.models ?? [];

  const translateError = (key: string | undefined): string | undefined =>
    key ? t(`errors.${key}` as "errors.required") : undefined;

  const acceptString = ATTACHMENT_ACCEPTED_TYPES.join(",");

  const validateAttachmentBatch = (
    incoming: File[],
    current: File[]
  ): { ok: true; merged: File[] } | { ok: false; reason: string } => {
    const merged = [...current, ...incoming];
    if (merged.length > ATTACHMENT_MAX_FILES) {
      return { ok: false, reason: "tooManyFiles" };
    }
    for (const f of incoming) {
      if (!(ATTACHMENT_ACCEPTED_TYPES as readonly string[]).includes(f.type)) {
        return { ok: false, reason: "wrongType" };
      }
      if (f.size > ATTACHMENT_MAX_FILE_BYTES) {
        return { ok: false, reason: "fileTooLarge" };
      }
    }
    const total = merged.reduce((s, f) => s + f.size, 0);
    if (total > ATTACHMENT_MAX_TOTAL_BYTES) {
      return { ok: false, reason: "totalTooLarge" };
    }
    return { ok: true, merged };
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-picking the same file after a removal
    if (incoming.length === 0) return;

    const result = validateAttachmentBatch(incoming, attachments);
    if (!result.ok) {
      setAttachmentError(result.reason);
      return;
    }
    setAttachments(result.merged);
    setAttachmentError(undefined);
  };

  const removeAttachment = (idx: number) => {
    setAttachments((cur) => cur.filter((_, i) => i !== idx));
    setAttachmentError(undefined);
  };

  const onSubmit = async (data: QuotePayload) => {
    setState({ status: "idle" });
    const itemsForApi = hasHydrated
      ? basketItems.map(({ slug, name, quantity }) => ({ slug, name, quantity }))
      : [];

    const fd = new FormData();
    fd.set("name", data.name);
    fd.set("email", data.email);
    fd.set("phone", data.phone);
    fd.set("vehicleMake", data.vehicleMake);
    fd.set("vehicleModel", data.vehicleModel);
    fd.set("vehicleYear", data.vehicleYear);
    fd.set("vehicleVin", data.vehicleVin);
    fd.set("partsNeeded", data.partsNeeded);
    fd.set("notes", data.notes);
    fd.set("items", JSON.stringify(itemsForApi));
    for (const file of attachments) {
      fd.append("attachments", file);
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setState({
          status: "error",
          message: json.error ?? t("errorGeneric"),
        });
        return;
      }
      setState({
        status: "success",
        emailSent: Boolean(json.emailSent),
        whatsappLink: typeof json.whatsappLink === "string" ? json.whatsappLink : "",
      });
      reset();
      clearBasket();
      setAttachments([]);
      setAttachmentError(undefined);
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : t("errorGeneric"),
      });
    }
  };

  if (state.status === "success") {
    return (
      <div className="border border-primary/40 bg-primary/5 p-8 text-center">
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
          {t("successTitle")}
        </h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {state.emailSent ? t("successEmailSent") : t("successEmailFailed")}
        </p>

        {state.whatsappLink && (
          <div className="mt-8">
            <p className="mb-4 text-sm text-muted-foreground">
              {t("successWhatsappCopy")}
            </p>
            <Button
              size="lg"
              className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              <a
                href={state.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <MessageCircle className="me-2 h-5 w-5" />
                {t("successWhatsappCta")}
              </a>
            </Button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-8 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
          {t("contactSection")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="name"
            label={t("name")}
            error={translateError(errors.name?.message)}
          >
            <Input
              id="name"
              autoComplete="name"
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
            />
          </Field>
          <Field
            name="email"
            label={t("email")}
            error={translateError(errors.email?.message)}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
            />
          </Field>
          <Field
            name="phone"
            label={t("phone")}
            error={translateError(errors.phone?.message)}
            className="sm:col-span-2"
          >
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register("phone")}
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>
        </div>
      </fieldset>

      {!hasItems && (
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
            {t("vehicleSection")}
          </legend>
          <p className="text-xs text-muted-foreground">
            {t("vehicleHint")}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              name="vehicleMake"
              label={t("vehicleMake")}
              error={translateError(errors.vehicleMake?.message)}
            >
              <Input
                id="vehicleMake"
                list="vehicle-makes"
                autoComplete="off"
                placeholder="Ford"
                {...register("vehicleMake")}
                aria-invalid={Boolean(errors.vehicleMake)}
              />
              <datalist id="vehicle-makes">
                {VEHICLE_MAKES.map((m) => (
                  <option key={m.slug} value={m.label} />
                ))}
              </datalist>
            </Field>
            <Field
              name="vehicleModel"
              label={t("vehicleModel")}
              error={translateError(errors.vehicleModel?.message)}
            >
              <Input
                id="vehicleModel"
                list="vehicle-models"
                autoComplete="off"
                placeholder="Mustang"
                {...register("vehicleModel")}
                aria-invalid={Boolean(errors.vehicleModel)}
              />
              <datalist id="vehicle-models">
                {modelsForMake.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>
            <Field
              name="vehicleYear"
              label={t("vehicleYear")}
              error={translateError(errors.vehicleYear?.message)}
            >
              <Input
                id="vehicleYear"
                list="vehicle-years"
                autoComplete="off"
                inputMode="numeric"
                placeholder="2018"
                {...register("vehicleYear")}
                aria-invalid={Boolean(errors.vehicleYear)}
              />
              <datalist id="vehicle-years">
                {VEHICLE_YEARS.map((y) => (
                  <option key={y} value={y} />
                ))}
              </datalist>
            </Field>
            <Field
              name="vehicleVin"
              label={`${t("vehicleVin")} (${t("optional")})`}
              error={translateError(errors.vehicleVin?.message)}
              className="sm:col-span-3"
            >
              <Input
                id="vehicleVin"
                autoComplete="off"
                {...register("vehicleVin")}
                aria-invalid={Boolean(errors.vehicleVin)}
              />
            </Field>
          </div>
        </fieldset>
      )}

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
          {hasItems ? t("notesSectionWithItems") : t("inquirySection")}
        </legend>
        {!hasItems && (
          <Field
            name="partsNeeded"
            label={t("partsNeeded")}
            error={translateError(errors.partsNeeded?.message)}
          >
            <Textarea
              id="partsNeeded"
              rows={5}
              placeholder={t("partsNeededPlaceholder")}
              {...register("partsNeeded")}
              aria-invalid={Boolean(errors.partsNeeded)}
            />
          </Field>
        )}
        <Field
          name="notes"
          label={
            hasItems
              ? `${t("notesWithItemsLabel")} (${t("optional")})`
              : `${t("notes")} (${t("optional")})`
          }
          error={translateError(errors.notes?.message)}
        >
          <Textarea
            id="notes"
            rows={hasItems ? 5 : 3}
            placeholder={
              hasItems
                ? t("notesWithItemsPlaceholder")
                : t("notesPlaceholder")
            }
            {...register("notes")}
            aria-invalid={Boolean(errors.notes)}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <Label htmlFor="quote-attachments">
            {t("attachments")} ({t("optional")})
          </Label>
          <input
            id="quote-attachments"
            type="file"
            multiple
            accept={acceptString}
            onChange={handleAttachmentChange}
            aria-invalid={Boolean(attachmentError)}
            className="block w-full cursor-pointer border border-border/50 bg-background text-sm text-foreground file:me-3 file:cursor-pointer file:border-0 file:bg-primary file:px-4 file:py-2 file:font-display file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-primary-foreground hover:file:bg-primary/90"
          />
          <p className="text-xs text-muted-foreground">
            {t("attachmentsHint")}
          </p>
          {attachmentError && (
            <p className="text-xs text-destructive">
              {translateError(attachmentError)}
            </p>
          )}
          {attachments.length > 0 && (
            <ul className="mt-2 space-y-1">
              {attachments.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-3 border border-border/50 bg-background px-3 py-2 text-xs"
                >
                  <Paperclip className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                  <span className="flex-1 truncate text-foreground">
                    {f.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {formatBytes(f.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    aria-label={t("attachmentRemove")}
                    className="ms-1 inline-flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      {state.status === "error" && (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {state.message}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="rounded-none bg-primary px-8 py-6 font-display text-base uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        <FileText className="me-2 h-5 w-5" />
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Field({
  name,
  label,
  error,
  className,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
