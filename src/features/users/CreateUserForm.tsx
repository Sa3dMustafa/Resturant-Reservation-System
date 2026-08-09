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

import {
  type CreateUserFormValues,
} from "@/schemas/user.schema";

import type { UserRole } from "@/types";

export function UserCreateForm({
  form,
  isPending,
  onSubmit,
  onCancel,
}: {
  form: UseFormReturn<CreateUserFormValues>;
  isPending: boolean;
  onSubmit: (values: CreateUserFormValues) => void;
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
        <Label>{t("username")}</Label>

        <Input {...form.register("username")} />

        {form.formState.errors.username && (
          <p className="text-xs text-destructive">
            {t(
              form.formState.errors.username.message
                ?.split(".")
                .pop() as never
            )}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>{t("password")}</Label>

        <Input
          type="password"
          {...form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-xs text-destructive">
            {tAuth(
              form.formState.errors.password.message
                ?.split(".")
                .pop() as never
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
            : t("createAccount")}
        </Button>
      </div>
    </form>
  );
}