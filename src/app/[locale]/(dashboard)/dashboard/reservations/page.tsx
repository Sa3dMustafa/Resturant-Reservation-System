"use client";

import { useTranslations } from "next-intl";
import { ReservationsTable } from "@/features/reservations/ReservationsTable";

export default function ReservationsPage() {
  const t = useTranslations("reservation");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-primary">{t("title")}</h1>
      <ReservationsTable />
    </div>
  );
}
