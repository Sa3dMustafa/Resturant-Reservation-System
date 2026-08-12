"use client";

import type { RestaurantTable } from "@/types";

import { TableGrid } from "./TableGrid";

type Props = {
  date: string;
  selectedTable: RestaurantTable | null;

  tables: RestaurantTable[];

  tablesLoading: boolean;
  tablesError: boolean;

  restaurantClosed: boolean;

  onRetry: () => void;

  onDateChange: (value: string) => void;

  onSelectTable: (
    table: RestaurantTable,
  ) => void;

  onContinue: () => void;
};

export function TableSelectionStep({
  date,
  selectedTable,
  tables,
  tablesLoading,
  tablesError,
  restaurantClosed,
  onRetry,
  onDateChange,
  onSelectTable,
  onContinue,
}: Props) {
  return (
    <TableGrid
      tables={tables}
      selectedTable={selectedTable}
      loading={tablesLoading}
      error={tablesError}
      restaurantClosed={restaurantClosed}
      onRetry={onRetry}
      onSelectTable={onSelectTable}
      onContinue={onContinue}
    />
  );
}