"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { UseFormReturn } from "react-hook-form";

import type { WorkingHoursFormValues } from "@/schemas/working-hours.schema";

type Props = {
  form: UseFormReturn<WorkingHoursFormValues>;
  index: number;
  dayOfWeek: number;
};

export function WorkingHoursDayRow({ form, index, dayOfWeek }: Props) {
  const t = useTranslations("workingHours");

  const isClosed = form.watch(`workingHours.${index}.isClosed`);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <div className="w-28 shrink-0 font-medium">
        {t(`days.${dayOfWeek}` as never)}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="time"
          disabled={isClosed}
          className="w-32"
          {...form.register(`workingHours.${index}.openTime`)}
        />

        <span className="text-muted-foreground">—</span>

        <Input
          type="time"
          disabled={isClosed}
          className="w-32"
          {...form.register(`workingHours.${index}.closeTime`)}
        />
      </div>

      <div className="ms-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {isClosed ? t("closed") : t("open")}
        </span>

        <Switch
          checked={!isClosed}
          onCheckedChange={(value) =>
            form.setValue(`workingHours.${index}.isClosed`, !value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </div>
    </div>
  );
}
