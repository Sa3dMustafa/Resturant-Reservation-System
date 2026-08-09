"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";

import {
  workingHoursSchema,
  type WorkingHoursFormValues,
} from "@/schemas/working-hours.schema";

import {
  useUpdateWorkingHours,
  useWorkingHours,
} from "@/hooks/useWorkingHours";

import { ApiRequestError } from "@/lib/api/client";

import { WorkingHoursDayRow } from "./WorkingHoursDayRow";
import { ApplyToAllDialog } from "./ApplyToAllDialog";

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export function WorkingHours() {
  const t = useTranslations("workingHours");
  const tCommon = useTranslations("common");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useWorkingHours();

  const updateMutation = useUpdateWorkingHours();

  const [applyOpen, setApplyOpen] = useState(false);

  const form = useForm<WorkingHoursFormValues>({
    resolver: zodResolver(workingHoursSchema),

    defaultValues: {
      workingHours: DAYS.map((dayOfWeek) => ({
        dayOfWeek,
        openTime: "09:00",
        closeTime: "23:00",
        isClosed: false,
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "workingHours",
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const byDay = new Map(
      data.map((day) => [
        day.dayOfWeek,
        day,
      ])
    );

    form.reset({
      workingHours: DAYS.map(
        (dayOfWeek) =>
          byDay.get(dayOfWeek) ?? {
            dayOfWeek,
            openTime: "09:00",
            closeTime: "23:00",
            isClosed: false,
          }
      ),
    });
  }, [data, form]);

  const onSubmit = (
    values: WorkingHoursFormValues
  ) => {
    updateMutation.mutate(values.workingHours, {
      onSuccess: () => {
        toast.success(
          tCommon("saveChanges")
        );
      },

      onError: (error) => {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : tCommon("somethingWentWrong");

        toast.error(message);
      },
    });
  };

  const applyToAll = (
    start: string,
    end: string
  ) => {
    DAYS.forEach((_, index) => {
      form.setValue(
        `workingHours.${index}.openTime`,
        start,
        {
          shouldDirty: true,
        }
      );

      form.setValue(
        `workingHours.${index}.closeTime`,
        end,
        {
          shouldDirty: true,
        }
      );

      form.setValue(
        `workingHours.${index}.isClosed`,
        false,
        {
          shouldDirty: true,
        }
      );
    });
  };

  if (isLoading) {
    return (
      <Card className="divide-y divide-border overflow-hidden">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex items-center gap-4 p-4"
          >
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="ms-auto h-6 w-10" />
          </div>
        ))}
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={refetch}
      />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setApplyOpen(true)}
        >
          {t("applyToAllDays")}
        </Button>
      </div>

      <Card className="divide-y divide-border overflow-hidden">
        {fields.length === 0 ? (
          <EmptyState
            title={t("empty.title")}
            description={t("empty.description")}
          />
        ) : (
          fields.map((field, index) => (
            <WorkingHoursDayRow
              key={field.id}
              form={form}
              index={index}
              dayOfWeek={field.dayOfWeek}
            />
          ))
        )}
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={updateMutation.isPending}
        >
          {tCommon("saveChanges")}
        </Button>
      </div>

      <ApplyToAllDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        onApply={applyToAll}
      />
    </form>
  );
}