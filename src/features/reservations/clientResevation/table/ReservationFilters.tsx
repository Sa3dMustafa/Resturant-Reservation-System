"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import type { RestaurantTable } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  date: string;
  selectedTable: RestaurantTable | null;
  restaurantClosed: boolean;

  onDateChange: (value: string) => void;
  onContinue: () => void;
};

export function ReservationFilters({
  date,
  selectedTable,
  restaurantClosed,
  onDateChange,
  onContinue,
}: Props) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  return (
    <Card className="order-first h-fit border-[#3f3f3f] bg-[#111] shadow-none lg:order-0">
      <CardContent className="p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#c99a2e]" />

          <h3 className="text-sm font-semibold text-white">
            {tCommon("date")}
          </h3>
        </div>

        <div className="mt-4 rounded-lg border border-[#333] bg-[#171717] p-3">
          <Label className="text-xs text-gray-400">
            {tCommon("date")}
          </Label>

          <Input
            type="date"
            value={date}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(event) => onDateChange(event.target.value)}
            className="mt-2 h-10 border-[#444] bg-[#191919] text-white scheme-dark"
          />
        </div>

        {restaurantClosed ? (
          <div className="mt-5 rounded-lg border border-red-900/50 bg-red-950/20 p-3">
            <p className="text-xs leading-5 text-red-400">
              {t("restaurantClosed")}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-[#4b3c1b] bg-[#17140d] p-3">
            <p className="text-xs leading-5 text-gray-400">
              {selectedTable
                ? `${t("table")}: ${selectedTable.tableNumber}`
                : t("selectTableFirst")}
            </p>
          </div>
        )}

        <Button
          type="button"
          disabled={!selectedTable || restaurantClosed}
          onClick={onContinue}
          className="mt-6 h-11 w-full bg-[#c99a2e] text-black hover:bg-[#ddb44b] disabled:bg-[#444] disabled:text-gray-600"
        >
          {tCommon("continue")}
        </Button>
      </CardContent>
    </Card>
  );
}