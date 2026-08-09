"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TimeSlotConfigFormValues } from "@/schemas/working-hours.schema";

const DURATIONS = [15, 30, 45, 60, 90, 120];

type Props = {
  form: UseFormReturn<TimeSlotConfigFormValues>;
};

export function SlotDurationFields({ form }: Props) {
  const t = useTranslations("timeSlots");

  return (
    <div className="space-y-1.5">
      <Label htmlFor="slot-duration">{t("slotDurationMinutes")}</Label>

      <Select
        value={String(form.watch("slotDurationMinutes"))}
        onValueChange={(value) =>
          form.setValue("slotDurationMinutes", Number(value), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      >
        <SelectTrigger id="slot-duration">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {DURATIONS.map((duration) => (
            <SelectItem key={duration} value={String(duration)}>
              {duration} min
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {form.formState.errors.slotDurationMinutes && (
        <p className="text-xs text-destructive">
          {t(
            form.formState.errors.slotDurationMinutes.message as
              | "errors.durationMin"
              | "errors.durationMax"
              | "errors.durationInteger",
          )}
        </p>
      )}
    </div>
  );
}
