"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Car } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  VEHICLE_MAKES,
  VEHICLE_YEARS,
  getMakeByLabel,
  getVerticalForMakeLabel,
} from "@/lib/vehicles";

export function VehiclePicker() {
  const t = useTranslations("home.vehiclePicker");
  const router = useRouter();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const knownMake = getMakeByLabel(make);
  const modelOptions = knownMake?.models ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vertical = getVerticalForMakeLabel(make);
    if (vertical) {
      router.push(`/shop?vehicle=${vertical}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <section className="relative border-b border-border/50 bg-surface-elevated">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("eyebrow")}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("headline")}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("subheadline")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid items-end gap-4 border border-border/50 bg-background p-6 sm:grid-cols-[1fr_1fr_minmax(0,140px)_auto] md:p-8"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="picker-make">{t("makeLabel")}</Label>
            <Input
              id="picker-make"
              list="picker-makes"
              autoComplete="off"
              placeholder={t("makePlaceholder")}
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel("");
              }}
            />
            <datalist id="picker-makes">
              {VEHICLE_MAKES.map((m) => (
                <option key={m.slug} value={m.label} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="picker-model">{t("modelLabel")}</Label>
            <Input
              id="picker-model"
              list="picker-models"
              autoComplete="off"
              placeholder={t("modelPlaceholder")}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <datalist id="picker-models">
              {modelOptions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="picker-year">{t("yearLabel")}</Label>
            <Input
              id="picker-year"
              list="picker-years"
              autoComplete="off"
              inputMode="numeric"
              placeholder={t("yearPlaceholder")}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <datalist id="picker-years">
              {VEHICLE_YEARS.map((y) => (
                <option key={y} value={y} />
              ))}
            </datalist>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-10 rounded-none bg-primary px-6 font-display text-sm uppercase tracking-wider text-primary-foreground hover:bg-primary/90 sm:h-[42px]"
          >
            <Car className="me-2 h-4 w-4" />
            {t("cta")}
            <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          {t("hint")}{" "}
          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {t("browseAll")}
          </button>
        </p>
      </div>
    </section>
  );
}
