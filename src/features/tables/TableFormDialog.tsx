"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createTableSchema,
  updateTableSchema,
  type CreateTableFormValues,
  type UpdateTableFormValues,
} from "@/schemas/table.schema";

import {
  useCreateTable,
  useUpdateTable,
} from "@/hooks/useTablesAdmin";

import { ApiRequestError } from "@/lib/api/client";

import type { RestaurantTable } from "@/types";

interface TableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: RestaurantTable | null;
}

export function TableFormDialog({
  open,
  onOpenChange,
  table,
}: TableFormDialogProps) {
  const t = useTranslations("table");
  const tCommon = useTranslations("common");

  const isEdit = !!table;

  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  const form = useForm<CreateTableFormValues>({
    resolver: zodResolver(
      isEdit ? updateTableSchema : createTableSchema,
    ) as never,
    defaultValues: {
      tableNumber: 0,
      capacity: 2,
      position: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset(
      table
        ? {
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            position: table.position,
          }
        : {
            tableNumber: 0,
            capacity: 2,
            position: "",
          },
    );
  }, [open, table]);

  const handleError = (err: unknown) => {
    const message =
      err instanceof ApiRequestError
        ? err.message
        : tCommon("somethingWentWrong");

    toast.error(message);
  };

  const onSubmit = (values: CreateTableFormValues) => {
    if (isEdit && table) {
      const payload: UpdateTableFormValues = {
        capacity: values.capacity,
        position: values.position,
      };

      updateMutation.mutate(
        {
          id: table.id,
          payload,
        },
        {
          onSuccess: () => {
            toast.success(t("updateTableToast"));
            onOpenChange(false);
          },
          onError: handleError,
        },
      );

      return;
    }

    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("table.createTableToast"));
        onOpenChange(false);
      },
      onError: handleError,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editTable") : t("addTable")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>{t("tableNumber")}</Label>

            <Input
              type="number"
              min={1}
              disabled={isEdit}
              {...form.register("tableNumber", {
                valueAsNumber: true,
              })}
            />

            {form.formState.errors.tableNumber && (
              <p className="text-xs text-destructive">
                {t(
                  form.formState.errors.tableNumber.message
                    ?.split(".")
                    .pop() as never,
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("capacity")}</Label>

            <Input
              type="number"
              min={1}
              {...form.register("capacity", {
                valueAsNumber: true,
              })}
            />

            {form.formState.errors.capacity && (
              <p className="text-xs text-destructive">
                {t(
                  form.formState.errors.capacity.message
                    ?.split(".")
                    .pop() as never,
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("position")}</Label>

            <Input {...form.register("position")} />

            {form.formState.errors.position && (
              <p className="text-xs text-destructive">
                {tCommon(
                  form.formState.errors.position.message as never,
                )}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {tCommon("cancel")}
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "..."
                : isEdit
                  ? tCommon("saveChanges")
                  : t("createTable")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}