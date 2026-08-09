"use client";

import { useTranslations } from "next-intl";
import { WorkingHours } from "@/features/working-hours/WorkingHours";

export default function WorkingHoursPage() {
  const t = useTranslations("workingHours");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-primary">{t("title")}</h1>
      <WorkingHours/>
    </div>
  );
}
