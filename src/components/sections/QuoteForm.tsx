"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FileText, MessageCircle } from "lucide-react";
import {
  quoteSchema,
  quoteFormDefaults,
  type QuotePayload,
} from "@/lib/quote-schema";
import { useHasHydrated, useQuoteBasket } from "@/lib/quote-store";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuotePayload>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteFormDefaults,
  });

  const translateError = (key: string | undefined): string | undefined =>
    key ? t(`errors.${key}` as "errors.required") : undefined;

  const onSubmit = async (data: QuotePayload) => {
    setState({ status: "idle" });
    const payload: QuotePayload = {
      ...data,
      items: hasHydrated
        ? basketItems.map(({ slug, name, quantity }) => ({ slug, name, quantity }))
        : [],
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              name="vehicleMake"
              label={t("vehicleMake")}
              error={translateError(errors.vehicleMake?.message)}
            >
              <Input
                id="vehicleMake"
                placeholder="Ford"
                {...register("vehicleMake")}
                aria-invalid={Boolean(errors.vehicleMake)}
              />
            </Field>
            <Field
              name="vehicleModel"
              label={t("vehicleModel")}
              error={translateError(errors.vehicleModel?.message)}
            >
              <Input
                id="vehicleModel"
                placeholder="Mustang GT"
                {...register("vehicleModel")}
                aria-invalid={Boolean(errors.vehicleModel)}
              />
            </Field>
            <Field
              name="vehicleYear"
              label={t("vehicleYear")}
              error={translateError(errors.vehicleYear?.message)}
            >
              <Input
                id="vehicleYear"
                inputMode="numeric"
                placeholder="2018"
                {...register("vehicleYear")}
                aria-invalid={Boolean(errors.vehicleYear)}
              />
            </Field>
            <Field
              name="vehicleVin"
              label={`${t("vehicleVin")} (${t("optional")})`}
              error={translateError(errors.vehicleVin?.message)}
              className="sm:col-span-3"
            >
              <Input
                id="vehicleVin"
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
