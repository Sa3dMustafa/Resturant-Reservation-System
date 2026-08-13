"use client";

import type { RestaurantTable } from "@/types";
import { useTranslations } from "next-intl";

import type { TimeSlot } from "../types";

import { TimeSlotGrid } from "./TimeSlotGrid";
import { ReservationProgress } from "../ReservationProgress";

type Props = {
  table: RestaurantTable;
  date: string;
  guestCount: number;

  availableSlots: TimeSlot[];
  selectedSlotIds: string[];
  occupiedSlotIds: Set<string>;

  slotsLoading: boolean;
  slotsError: boolean;

  onToggleSlot: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function TimeSelectionStep({
  table,
  date,
  guestCount,
  availableSlots,
  selectedSlotIds,
  occupiedSlotIds,
  slotsLoading,
  slotsError,
  onToggleSlot,
  onBack,
  onContinue,
}: Props) {
  const t = useTranslations("reservation");

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
      <ReservationProgress currentStep={2} steps={progressSteps} />

      <TimeSlotGrid
        table={table}
        date={date}
        guestCount={guestCount}
        slots={availableSlots}
        selectedSlotIds={selectedSlotIds}
        occupiedSlotIds={occupiedSlotIds}
        loading={slotsLoading}
        error={slotsError}
        onToggleSlot={onToggleSlot}
        onBack={onBack}
        onContinue={onContinue}
      />
    </div>
  );
}