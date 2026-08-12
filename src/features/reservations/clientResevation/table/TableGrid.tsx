"use client";

import type { RestaurantTable } from "@/types";

import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

import { TableCard } from "./TableCard";

type Props = {
  tables: RestaurantTable[];
  selectedTable: RestaurantTable | null;

  loading: boolean;
  error: boolean;

  restaurantClosed: boolean;

  onRetry: () => void;

  onSelectTable: (table: RestaurantTable) => void;

  onContinue: () => void;
};

export function TableGrid({
  tables,
  selectedTable,
  loading,
  error,
  restaurantClosed,
  onRetry,
  onSelectTable,
  onContinue,
}: Props) {
  const t = useTranslations("reservation");

  const handleSelectTable = (table: RestaurantTable) => {
    onSelectTable(table);

    setTimeout(() => {
      onContinue();
    }, 0);
  };

  return (
    <Card className="border-[#3f3f3f] bg-[#111] shadow-none">
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">
            {t("table")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("chooseTableAndTime")}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-67.5 rounded-xl bg-[#222]"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={onRetry} />
        ) : restaurantClosed ? (
          <EmptyState title={t("restaurantClosed")} />
        ) : tables.length === 0 ? (
          <EmptyState title={t("errors.tableRequired")} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                selected={selectedTable?.id === table.id}
                onSelect={handleSelectTable}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}