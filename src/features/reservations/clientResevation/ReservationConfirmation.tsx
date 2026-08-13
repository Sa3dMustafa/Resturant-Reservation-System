"use client";

import { CalendarDays, CheckCircle2, Hash, MapPin, Users2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import type { CreatedReservation, RestaurantTable } from "@/types";

import { ReservationProgress } from "./ReservationProgress";

type Props = {
  reservation: CreatedReservation;
  table: RestaurantTable;
  clientName: string;
};

export function ReservationConfirmation({
  reservation,
  table,
  clientName,
}: Props) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const progressSteps = [
    {
      number: 1,
      label: t("table"),
    },
    {
      number: 2,
      label: t("selectTimeSlot"),
    },
    {
      number: 3,
      label: t("personalInfo"),
    },
  ];

  return (
    <div>
      <ReservationProgress currentStep={3} steps={progressSteps} />

      <Card className="mx-auto max-w-2xl border-[#4b3c1b] bg-[#111] shadow-none">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173b26]">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-white">
              {t("reservationConfirmed")}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {t("confirmationSubtitle")}
            </p>
          </div>

          <div className="mt-7 space-y-4 rounded-lg border border-[#4b3c1b] bg-[#17140d] p-5">
            <Row icon={<Users2 className="h-4 w-4" />} label={tCommon("name")} value={clientName} />

            <Row icon={<CalendarDays className="h-4 w-4" />} label={tCommon("date")} value={reservation.date} />

            <Row icon={<MapPin className="h-4 w-4" />} label={t("table")} value={String(table.tableNumber)} />

            <Row icon={<Users2 className="h-4 w-4" />} label={t("guests")} value={String(reservation.guestCount)} />
          </div>

          <div className="mt-5 rounded-lg border border-[#4b3c1b] bg-[#17140d] p-5 text-center">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500">
              <Hash className="h-3.5 w-3.5" />
              {t("reservationCode")}
            </div>

            <p className="mt-2 font-mono text-xl font-semibold tracking-wider text-[#d8b45b]">
              {reservation.reservationCode}
            </p>
          </div>

          <Button asChild className="mt-6 h-11 w-full bg-[#c99a2e] text-black hover:bg-[#ddb44b]">
            <Link href="/">{tCommon("close")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#2d271a] pb-3 last:border-b-0 last:pb-0">
      <span className="flex items-center gap-2 text-xs text-gray-500">
        {icon}
        {label}
      </span>

      <span className="text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}