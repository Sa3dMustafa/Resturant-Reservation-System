"use client";

import { useTranslations } from "next-intl";
import { SlotDurationForm } from "@/features/time-slots/SlotDurationForm";

export default function SlotDurationPage() {
  const t = useTranslations("timeSlots");
  return (
    <div className="space-y-6 w-1/2">
      <h1 className="font-display text-2xl font-semibold text-primary">{t("title")}</h1>
      <SlotDurationForm />
    </div>
  );
}
