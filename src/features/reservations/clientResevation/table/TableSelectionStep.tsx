"use client";

import type { RestaurantTable } from "@/types";

import { ReservationFilters } from "./ReservationFilters";
import { TableGrid } from "./TableGrid";

type Props = {
  date: string;
  guestCount: number;
  selectedTable: RestaurantTable | null;

  tables: RestaurantTable[];

  tablesLoading: boolean;
  tablesError: boolean;

  onRetry: () => void;

  onDateChange: (value: string) => void;
  onGuestCountChange: (value: number) => void;

  onSelectTable: (table: RestaurantTable) => void;

  onContinue: () => void;
};

export function TableSelectionStep({
  date,
  guestCount,
  selectedTable,
  tables,
  tablesLoading,
  tablesError,
  onRetry,
  onDateChange,
  onGuestCountChange,
  onSelectTable,
  onContinue,
}: Props) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
      <TableGrid
        tables={tables}
        selectedTable={selectedTable}
        loading={tablesLoading}
        error={tablesError}
        onRetry={onRetry}
        onSelectTable={onSelectTable}
      />

      <ReservationFilters
        date={date}
        guestCount={guestCount}
        selectedTable={selectedTable}
        onDateChange={onDateChange}
        onGuestCountChange={onGuestCountChange}
        onContinue={onContinue}
      />
    </div>
  );
}
