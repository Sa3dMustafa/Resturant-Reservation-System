"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  timeSlotConfigSchema,
  type TimeSlotConfigFormValues,
} from "@/schemas/working-hours.schema";

import { useUpdateTimeSlotConfig } from "@/hooks/useWorkingHours";
import { ApiRequestError } from "@/lib/api/client";

import { SlotDurationFields } from "./SlotDurationFields";

export function SlotDurationForm() {
  const t = useTranslations("timeSlots");
  const tCommon = useTranslations("common");

  const mutation = useUpdateTimeSlotConfig();

  const form = useForm<TimeSlotConfigFormValues>({
    resolver: zodResolver(
      timeSlotConfigSchema
    ) as never,

    defaultValues: {
      slotDurationMinutes: 60,
    },
  });

  const onSubmit = (
    values: TimeSlotConfigFormValues
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success(
          t("updateSuccess")
        );
      },

      onError: (error) => {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : tCommon(
                "somethingWentWrong"
              );

        toast.error(message);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <SlotDurationFields
            form={form}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              disabled={mutation.isPending}
            >
              {tCommon("cancel")}
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? tCommon("saving")
                : tCommon("saveChanges")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}