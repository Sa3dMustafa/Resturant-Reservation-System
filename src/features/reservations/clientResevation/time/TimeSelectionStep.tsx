"use client";

import type { RestaurantTable } from "@/types";

import type { TimeSlot } from "../types";

import { TimeSlotGrid } from "./TimeSlotGrid";

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
  return (
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
  );
}
