"use client";

import { Check, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RestaurantTable } from "@/types";
import type { TimeSlot } from "../types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";

type Props = {
  table: RestaurantTable;
  date: string;
  guestCount: number;

  slots: TimeSlot[];
  selectedSlotIds: string[];
  occupiedSlotIds: Set<string>;

  loading: boolean;
  error: boolean;

  onToggleSlot: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

function canSelectSlot(
  slot: TimeSlot,
  slots: TimeSlot[],
  selectedSlotIds: string[],
  occupiedSlotIds: Set<string>,
) {
  if (occupiedSlotIds.has(slot.id)) {
    return false;
  }

  if (selectedSlotIds.length === 0) {
    return true;
  }

  if (selectedSlotIds.includes(slot.id)) {
    return true;
  }

  const selectedSlots = slots
    .filter((item) => selectedSlotIds.includes(item.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const first = selectedSlots[0];
  const last = selectedSlots[selectedSlots.length - 1];

  if (!first || !last) {
    return true;
  }

  return (
    slot.endTime === first.startTime ||
    last.endTime === slot.startTime
  );
}

export function TimeSlotGrid({
  table,
  date,
  guestCount,
  slots,
  selectedSlotIds,
  occupiedSlotIds,
  loading,
  error,
  onToggleSlot,
  onBack,
  onContinue,
}: Props) {
  const t = useTranslations("reservation");
  const common = useTranslations("common");

  return (
    <Card className="border-[#3f3f3f] bg-[#111] shadow-none">
      <CardContent className="p-5">
        {/* STEP HEADER */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#c99a2e]" />

              <h2 className="text-xl font-semibold text-white">
                {t("selectTimeSlot")}
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {table.tableNumber} · {date} · {guestCount}{" "}
              {t("guests").toLowerCase()}
            </p>
          </div>

          <div className="rounded-lg border border-[#4b3c1b] bg-[#17140d] px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              {t("table")}
            </p>

            <p className="mt-1 font-semibold text-[#d8b45b]">
              {table.tableNumber}
            </p>
          </div>
        </div>

        {/* TIME SLOTS */}
        <div className="mt-7">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-14 rounded-lg bg-[#222]"
                />
              ))}
            </div>
          ) : error ? (
            <ErrorState />
          ) : slots.length === 0 ? (
            <EmptyState title={t("errors.timeSlotRequired")} />
          ) : (
            <>
              <div className="mb-4 rounded-lg border border-[#4b3c1b] bg-[#17140d] px-4 py-3">
                <p className="text-xs leading-5 text-gray-400">
                  {t("consecutiveSlotsOnly")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {slots.map((slot) => {
                  const occupied = occupiedSlotIds.has(slot.id);
                  const selected = selectedSlotIds.includes(slot.id);

                  const selectable = canSelectSlot(
                    slot,
                    slots,
                    selectedSlotIds,
                    occupiedSlotIds,
                  );

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={occupied || !selectable}
                      onClick={() => onToggleSlot(slot.id)}
                      className={`flex min-h-14 items-center justify-center rounded-lg border px-3 py-3 text-sm font-medium transition-all ${occupied ? "cursor-not-allowed border-[#333] bg-[#171717] text-gray-600 line-through" : selected ? "border-[#c99a2e] bg-[#c99a2e] text-black ring-1 ring-[#c99a2e]" : !selectable ? "cursor-not-allowed border-[#333] bg-[#151515] text-gray-700 opacity-50" : "border-[#3e3e3e] bg-[#151515] text-white hover:border-[#c99a2e] hover:bg-[#1b180f]"}`}
                    >
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>

                      {selected && (
                        <Check className="ms-2 h-4 w-4" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#2d2d2d] pt-6 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={onBack} className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]">
            {common("back")}
          </Button>

          <Button type="button" disabled={selectedSlotIds.length === 0} onClick={onContinue} className="bg-[#c99a2e] text-black hover:bg-[#ddb44b] disabled:bg-[#444] disabled:text-gray-600">
            {common("continue")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}