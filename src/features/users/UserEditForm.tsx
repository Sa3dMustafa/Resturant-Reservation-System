"use client";

import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import {
  type UpdateUserFormValues,
} from "@/schemas/user.schema";

import type { UserRole } from "@/types";

export function UserEditForm({
  form,
  isPending,
  onSubmit,
  onCancel,
}: {
  form: UseFormReturn<UpdateUserFormValues>;
  isPending: boolean;
  onSubmit: (values: UpdateUserFormValues) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label>{tCommon("name")}</Label>

        <Input {...form.register("name")} />

        {form.formState.errors.name && (
          <p className="text-xs text-destructive">
            {tCommon(
              form.formState.errors.name.message as never
            )}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>{t("role")}</Label>

        <Select
          value={form.watch("role")}
          onValueChange={(value) =>
            form.setValue(
              "role",
              value as UserRole,
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">
              {t("roles.ADMIN")}
            </SelectItem>

            <SelectItem value="STAFF">
              {t("roles.STAFF")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
        <Label className="text-foreground">
          {tCommon("active")}
        </Label>

        <Switch
          checked={form.watch("isActive")}
          onCheckedChange={(value) =>
            form.setValue(
              "isActive",
              value,
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            )
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t("newPassword")}</Label>

        <Input
          type="password"
          {...form.register("newPassword")}
        />

        {form.formState.errors.newPassword && (
          <p className="text-xs text-destructive">
            {tAuth(
              form.formState.errors.newPassword.message
                ?.split(".")
                .pop() as never
            )}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>{t("confirmNewPassword")}</Label>

        <Input
          type="password"
          {...form.register("confirmNewPassword")}
        />

        {form.formState.errors.confirmNewPassword && (
          <p className="text-xs text-destructive">
            {tAuth(
              form.formState.errors.confirmNewPassword.message
                ?.split(".")
                .pop() as never
            )}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          {tCommon("cancel")}
        </Button>

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? tCommon("saving")
            : tCommon("saveChanges")}
        </Button>
      </div>
    </form>
  );
}