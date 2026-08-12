"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTablesList } from "@/hooks/useTablesAdmin";

import type {
  ReservationsQueryParams,
  ReservationStatus,
} from "@/types";

const STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

export function ReservationFiltersPopover({
  filters,
  onChange,
}: {
  filters: Partial<ReservationsQueryParams>;
  onChange: (filters: Partial<ReservationsQueryParams>) => void;
}) {
  const t = useTranslations("reservation.filters");
  const tStatus = useTranslations("reservation.status");
  const tCommon = useTranslations("common");

  const { data: tables } = useTablesList();

  const today = format(new Date(), "yyyy-MM-dd");

  const activeCount = Object.entries(filters).filter(
    ([key, value]) =>
      key !== "date" &&
      value !== undefined &&
      value !== null &&
      value !== "",
  ).length;

  const currentDate = filters.date ?? today;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="relative"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {tCommon("filters")}

          {activeCount > 0 && (
            <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-5" align="end">
        <div className="space-y-1.5">
          <Label>{t("status")}</Label>

          <Select
            value={filters.status ?? "ALL"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                status:
                  value === "ALL"
                    ? undefined
                    : (value as ReservationStatus),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                {tCommon("clearAll")}
              </SelectItem>

              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {tStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>{t("table")}</Label>

          <Select
            value={filters.tableId ?? "ALL"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                tableId:
                  value === "ALL" ? undefined : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                {tCommon("clearAll")}
              </SelectItem>

              {tables?.map((table) => (
                <SelectItem
                  key={table.id}
                  value={table.id}
                >
                  {table.tableNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>{t("date")}</Label>

          <Input
            type="date"
            value={currentDate}
            onChange={(event) =>
              onChange({
                ...filters,
                date: event.target.value || today,
              })
            }
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() =>
            onChange({
              date: currentDate,
            })
          }
        >
          {tCommon("clearAll")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}