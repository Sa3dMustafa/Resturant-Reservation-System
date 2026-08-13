"use client";

import { useMemo, useState } from "react";
import { format, parse } from "date-fns";

import { useActiveTimeSlots, useTables } from "@/hooks/useReservations";
import { useWorkingHours } from "@/hooks/useWorkingHours";

import type { CreatedReservation, RestaurantTable } from "@/types";

import type { ReservationStep, TimeSlot } from "./types";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function getDayOfWeek(date: string) {
  return parse(date, "yyyy-MM-dd", new Date()).getDay();
}

function isSlotInsideWorkingHours(
  slot: TimeSlot,
  workingHour: {
    openTime: string;
    closeTime: string;
  },
) {
  const slotStart = timeToMinutes(slot.startTime);
  const slotEnd = timeToMinutes(slot.endTime);

  const opening = timeToMinutes(workingHour.openTime);
  const closing = timeToMinutes(workingHour.closeTime);

  return slotStart >= opening && slotEnd <= closing;
}

function areSlotsConsecutive(slots: TimeSlot[]) {
  if (slots.length <= 1) {
    return true;
  }

  const sorted = [...slots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  for (let index = 1; index < sorted.length; index++) {
    const previous = sorted[index - 1];
    const current = sorted[index];

    if (previous.endTime !== current.startTime) {
      return false;
    }
  }

  return true;
}

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
  } = useTables({
    date,
  });

  const {
    data: activeSlots,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useActiveTimeSlots();

  const {
    data: workingHours,
    isLoading: workingHoursLoading,
    isError: workingHoursError,
  } = useWorkingHours();

  const selectedDayOfWeek = useMemo(() => {
    return getDayOfWeek(date);
  }, [date]);

  const selectedWorkingHour = useMemo(() => {
    return (
      workingHours?.find((day) => day.dayOfWeek === selectedDayOfWeek) ?? null
    );
  }, [workingHours, selectedDayOfWeek]);

  const isRestaurantClosed = Boolean(selectedWorkingHour?.isClosed);

  const eligibleTables = useMemo(() => {
    if (isRestaurantClosed) {
      return [];
    }

    return (tables ?? []).filter(
      (table) => table.capacity >= guestCount && table.status === "AVAILABLE",
    );
  }, [tables, guestCount, isRestaurantClosed]);

  const occupiedSlotIds = useMemo(() => {
    if (!selectedTable?.reservations) {
      return new Set<string>();
    }

    const ids = selectedTable.reservations
      .filter((reservation) => reservation.status !== "CANCELLED")
      .flatMap((reservation) => reservation.slots.map((slot) => slot.id));

    return new Set<string>(ids);
  }, [selectedTable]);

  const availableSlots = useMemo<TimeSlot[]>(() => {
    if (!selectedWorkingHour || selectedWorkingHour.isClosed) {
      return [];
    }

    return (activeSlots ?? [])
      .filter((slot) => slot.isActive)
      .filter((slot) => isSlotInsideWorkingHours(slot, selectedWorkingHour));
  }, [activeSlots, selectedWorkingHour]);

  const selectedSlots = useMemo(() => {
    return selectedSlotIds
      .map((id) => availableSlots.find((slot) => slot.id === id))
      .filter((slot): slot is TimeSlot => Boolean(slot));
  }, [selectedSlotIds, availableSlots]);

  const hasValidSelectedSlots = useMemo(() => {
    return selectedSlots.length > 0 && areSlotsConsecutive(selectedSlots);
  }, [selectedSlots]);

  const handleDateChange = (value: string) => {
    setDate(value);
    setSelectedTable(null);
    setSelectedSlotIds([]);
    setStep("table");
  };

  const handleGuestCountChange = (value: number) => {
    const nextValue = Math.max(1, value || 1);

    /*
     * لو المستخدم بيغير عدد الضيوف من Personal Info
     * مانرجعش للـ table step.
     *
     * لأن ده كان السبب إن Dialog بيختفي عند الضغط
     * على + أو -.
     */
    if (step === "personalInfo") {
      if (selectedTable) {
        const clampedValue = Math.min(selectedTable.capacity, nextValue);

        setGuestCount(clampedValue);
        return;
      }

      setGuestCount(nextValue);
      return;
    }

    /*
     * في Table Selection:
     * تغيير عدد الضيوف ممكن يخلي الـ table الحالية
     * غير مناسبة، لذلك نعمل reset للاختيار.
     */
    setGuestCount(nextValue);
    setSelectedTable(null);
    setSelectedSlotIds([]);
    setStep("table");
  };

  const handleSelectTable = (table: RestaurantTable) => {
    if (
      table.status !== "AVAILABLE" ||
      table.capacity < guestCount ||
      isRestaurantClosed
    ) {
      return false;
    }

    setSelectedTable(table);
    setSelectedSlotIds([]);

    return true;
  };

  /*
   * اختيار الـ table والانتقال للـ time step
   * بيحصلوا في نفس العملية.
   *
   * دي أهم نقطة في حل مشكلة أول click.
   */
  const handleTableSelectAndContinue = (table: RestaurantTable) => {
    if (
      table.status !== "AVAILABLE" ||
      table.capacity < guestCount ||
      isRestaurantClosed ||
      availableSlots.length === 0
    ) {
      return false;
    }

    setSelectedTable(table);
    setSelectedSlotIds([]);
    setStep("time");

    return true;
  };

  const handleTableContinue = () => {
    if (!selectedTable || isRestaurantClosed || availableSlots.length === 0) {
      return;
    }

    setSelectedSlotIds([]);
    setStep("time");
  };

  const handleToggleSlot = (id: string) => {
    if (occupiedSlotIds.has(id)) {
      return;
    }

    const clickedSlot = availableSlots.find((slot) => slot.id === id);

    if (!clickedSlot) {
      return;
    }

    setSelectedSlotIds((previous) => {
      if (previous.includes(id)) {
        if (previous.length === 1) {
          return [];
        }

        const selected = previous
          .map((slotId) => availableSlots.find((slot) => slot.id === slotId))
          .filter((slot): slot is TimeSlot => Boolean(slot))
          .sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
          );

        const first = selected[0];
        const last = selected[selected.length - 1];

        if (clickedSlot.id !== first?.id && clickedSlot.id !== last?.id) {
          return previous;
        }

        return previous.filter((slotId) => slotId !== id);
      }

      if (previous.length === 0) {
        return [id];
      }

      const selected = previous
        .map((slotId) => availableSlots.find((slot) => slot.id === slotId))
        .filter((slot): slot is TimeSlot => Boolean(slot));

      const first = selected.reduce((min, slot) =>
        timeToMinutes(slot.startTime) < timeToMinutes(min.startTime)
          ? slot
          : min,
      );

      const last = selected.reduce((max, slot) =>
        timeToMinutes(slot.startTime) > timeToMinutes(max.startTime)
          ? slot
          : max,
      );

      const isBefore = clickedSlot.endTime === first.startTime;

      const isAfter = last.endTime === clickedSlot.startTime;

      if (!isBefore && !isAfter) {
        return previous;
      }

      if (occupiedSlotIds.has(id)) {
        return previous;
      }

      return [...previous, id];
    });
  };

  const handleTimeContinue = () => {
    if (!selectedTable || !hasValidSelectedSlots) {
      return;
    }

    setStep("personalInfo");
  };

  const handleBackToTable = () => {
    setSelectedSlotIds([]);
    setSelectedTable(null);
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

    selectedWorkingHour,
    isRestaurantClosed,

    hasValidSelectedSlots,

    tablesLoading,
    tablesError,

    slotsLoading,
    slotsError,

    workingHoursLoading,
    workingHoursError,

    refetchTables,

    handleDateChange,
    handleGuestCountChange,

    handleSelectTable,
    handleTableContinue,
    handleTableSelectAndContinue,

    handleToggleSlot,
    handleTimeContinue,

    handleBackToTable,
    handleBackToTime,

    handleReservationSuccess,
  };
}
