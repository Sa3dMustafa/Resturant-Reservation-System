"use client";

import { Check, Utensils, Users2 } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RestaurantTable } from "@/types";

import { TableStatusBadge } from "@/components/shared/StatusBadge";

type Props = {
  table: RestaurantTable;
  selected: boolean;
  onSelect: (table: RestaurantTable) => void;
};

export function TableCard({
  table,
  selected,
  onSelect,
}: Props) {
  const t = useTranslations("reservation");

  const available = table.status === "AVAILABLE";

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => onSelect(table)}
      className={`group relative flex min-h-67.5 flex-col items-center rounded-xl border bg-[#151515] p-3 text-start transition-all duration-200 ${available ? "border-[#3f3f3f] hover:border-[#c99a2e] hover:bg-[#181818]" : "cursor-not-allowed border-[#333] opacity-45"} ${selected ? "border-[#c99a2e] bg-[#1c180e] ring-1 ring-[#c99a2e]" : ""}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="rounded-full border border-[#454545] bg-[#191919] px-2.5 py-1 text-[10px] font-medium lowercase text-[#d8b45b]">
          {table.position}
        </span>

        {selected && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c99a2e]">
            <Check className="h-3 w-3 text-black" />
          </span>
        )}
      </div>

      <div className="relative mt-5 flex h-28 w-28 items-center justify-center rounded-full border-[7px] border-[#6d6d6d] bg-[#ded9cd] shadow-inner">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#b99a52] bg-[#f1eee6]">
          <Utensils className="h-7 w-7 text-[#6c5320]" />
        </div>

        <span className="absolute -top-5 rounded-md bg-[#202020] px-2 py-1 text-xs font-semibold text-white">
          {table.tableNumber}
        </span>
      </div>

      <div className="mt-5 flex w-full items-center justify-between gap-2 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Users2 className="h-3 w-3" />

          {table.capacity} {t("guests").toLowerCase()}
        </span>

        <TableStatusBadge status={table.status} />
      </div>

      <span className="mt-auto w-full rounded-md bg-[#c99a2e] py-2 text-center text-xs font-medium text-black transition-colors group-hover:bg-[#ddb44b]">
        {selected ? t("selected") : t("selectTable")}
      </span>
    </button>
  );
}