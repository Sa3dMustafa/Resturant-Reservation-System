"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import { useActiveTimeSlots, useTables } from "@/hooks/useReservations";

import type { CreatedReservation, RestaurantTable } from "@/types";

import type { ReservationStep, TimeSlot } from "./types";

export function useReservationWizard() {
  const [step, setStep] = useState<ReservationStep>("table");

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [guestCount, setGuestCount] = useState(2);

  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(
    null,
  );

  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);

  const [confirmedReservation, setConfirmedReservation] =
    useState<CreatedReservation | null>(null);

  const [confirmedClientName, setConfirmedClientName] = useState("");

  const {
    data: tables,
    isLoading: tablesLoading,
    isError: tablesError,
    refetch: refetchTables,
  } = useTables({ date });

  const {
    data: activeSlots,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useActiveTimeSlots();

  const eligibleTables = useMemo(
    () => (tables ?? []).filter((table) => table.capacity >= guestCount),
    [tables, guestCount],
  );

  const occupiedSlotIds = useMemo(() => {
    if (!selectedTable?.reservations) {
      return new Set<string>();
    }

    const ids = selectedTable.reservations
      .filter((reservation) => reservation.status !== "CANCELLED")
      .flatMap((reservation) => reservation.slots.map((slot) => slot.id));

    return new Set<string>(ids);
  }, [selectedTable]);

  const availableSlots = useMemo<TimeSlot[]>(
    () => (activeSlots ?? []).filter((slot) => slot.isActive),
    [activeSlots],
  );

  const handleDateChange = (value: string) => {
    setDate(value);
    setSelectedTable(null);
    setSelectedSlotIds([]);
    setStep("table");
  };

  const handleGuestCountChange = (value: number) => {
    const nextValue = Math.max(1, value || 1);

    setGuestCount(nextValue);
    setSelectedTable(null);
    setSelectedSlotIds([]);
    setStep("table");
  };

  const handleSelectTable = (table: RestaurantTable) => {
    if (table.status !== "AVAILABLE") {
      return;
    }

    setSelectedTable(table);
    setSelectedSlotIds([]);
  };

  const handleTableContinue = () => {
    if (!selectedTable) {
      return;
    }

    setSelectedSlotIds([]);
    setStep("time");
  };

  const handleToggleSlot = (id: string) => {
    if (occupiedSlotIds.has(id)) {
      return;
    }

    setSelectedSlotIds((previous) =>
      previous.includes(id)
        ? previous.filter((slotId) => slotId !== id)
        : [...previous, id],
    );
  };

  const handleTimeContinue = () => {
    if (!selectedTable || selectedSlotIds.length === 0) {
      return;
    }

    setStep("personalInfo");
  };

  const handleBackToTable = () => {
    setSelectedSlotIds([]);
    setStep("table");
  };

  const handleBackToTime = () => {
    setStep("time");
  };

  const handleReservationSuccess = (
    reservation: CreatedReservation,
    clientName: string,
  ) => {
    setConfirmedReservation(reservation);
    setConfirmedClientName(clientName);
    setStep("confirmed");
  };

  const currentStep =
    step === "table"
      ? 1
      : step === "time"
        ? 2
        : step === "personalInfo"
          ? 3
          : 4;

  return {
    step,
    currentStep,

    date,
    guestCount,

    selectedTable,
    selectedSlotIds,

    confirmedReservation,
    confirmedClientName,

    eligibleTables,
    availableSlots,
    occupiedSlotIds,

    tablesLoading,
    tablesError,
    slotsLoading,
    slotsError,

    refetchTables,

    handleDateChange,
    handleGuestCountChange,
    handleSelectTable,
    handleTableContinue,

    handleToggleSlot,
    handleTimeContinue,

    handleBackToTable,
    handleBackToTime,

    handleReservationSuccess,
  };
}
