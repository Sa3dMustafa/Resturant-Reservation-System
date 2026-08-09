import type { CreatedReservation, RestaurantTable } from "@/types";

export type ReservationStep = "table" | "time" | "personalInfo" | "confirmed";

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

export type ReservationWizardState = {
  date: string;
  guestCount: number;
  selectedTable: RestaurantTable | null;
  selectedSlotIds: string[];
  confirmedReservation: CreatedReservation | null;
  confirmedClientName: string;
};
