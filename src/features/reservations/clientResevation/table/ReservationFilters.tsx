"use client";

import { CalendarDays, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

import type { RestaurantTable } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  date: string;
  guestCount: number;
  selectedTable: RestaurantTable | null;

  onDateChange: (value: string) => void;
  onGuestCountChange: (value: number) => void;
  onContinue: () => void;
};

export function ReservationFilters({
  date,
  guestCount,
  selectedTable,
  onDateChange,
  onGuestCountChange,
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
          <Label className="text-xs text-gray-400">{tCommon("date")}</Label>

          <Input
            type="date"
            value={date}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(event) => onDateChange(event.target.value)}
            className="mt-2 h-10 border-[#444] bg-[#191919] text-white scheme-dark"
          />
        </div>

        <div className="mt-5 border-t border-[#2d2d2d] pt-5">
          <Label className="text-xs text-gray-400">{t("guestCount")}</Label>

          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={guestCount <= 1}
              onClick={() => onGuestCountChange(guestCount - 1)}
              className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              min={1}
              value={guestCount}
              onChange={(event) =>
                onGuestCountChange(Number(event.target.value))
              }
              className="border-[#4b4b4b] bg-[#191919] text-center text-white"
            />

            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => onGuestCountChange(guestCount + 1)}
              className="border-[#4b4b4b] bg-transparent text-white hover:bg-[#222]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          type="button"
          disabled={!selectedTable}
          onClick={onContinue}
          className="mt-6 h-11 w-full bg-[#c99a2e] text-black hover:bg-[#ddb44b] disabled:bg-[#444] disabled:text-gray-600"
        >
          {tCommon("continue")}
        </Button>
      </CardContent>
    </Card>
  );
}
