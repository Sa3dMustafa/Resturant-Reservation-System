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

import type { CreateUserFormValues } from "@/schemas/user.schema";
import type { UserRole } from "@/types";

interface UserCreateFormProps {
  form: UseFormReturn<CreateUserFormValues>;
  isPending: boolean;
  onSubmit: (values: CreateUserFormValues) => void;
  onCancel: () => void;
}

export function UserCreateForm({
  form,
  isPending,
  onSubmit,
  onCancel,
}: UserCreateFormProps) {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  const nameError = form.formState.errors.name?.message;
  const usernameError = form.formState.errors.username?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="create-user-name">
          {tCommon("name")}
        </Label>

        <Input
          id="create-user-name"
          {...form.register("name")}
          disabled={isPending}
        />

        {nameError && (
          <p className="text-xs text-destructive">
            {tCommon(nameError as never)}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="create-user-username">
          {t("username")}
        </Label>

        <Input
          id="create-user-username"
          {...form.register("username")}
          disabled={isPending}
        />

        {usernameError && (
          <p className="text-xs text-destructive">
            {t(
              usernameError.split(".").pop() as never,
            )}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="create-user-password">
          {t("password")}
        </Label>

        <Input
          id="create-user-password"
          type="password"
          {...form.register("password")}
          disabled={isPending}
        />

        {passwordError && (
          <p className="text-xs text-destructive">
            {tAuth(
              passwordError.split(".").pop() as never,
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
              },
            )
          }
          disabled={isPending}
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