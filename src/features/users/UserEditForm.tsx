"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

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

import type { UpdateUserFormValues } from "@/schemas/user.schema";
import type { UserRole } from "@/types";

interface UserEditFormProps {
  form: UseFormReturn<UpdateUserFormValues>;
  isPending: boolean;
  onSubmit: (values: UpdateUserFormValues) => void;
  onCancel: () => void;
}

export function UserEditForm({
  form,
  isPending,
  onSubmit,
  onCancel,
}: UserEditFormProps) {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const nameError = form.formState.errors.name?.message;
  const newPasswordError =
    form.formState.errors.newPassword?.message;
  const confirmPasswordError =
    form.formState.errors.confirmNewPassword?.message;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="edit-user-name">
          {tCommon("name")}
        </Label>

        <Input
          id="edit-user-name"
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
        <Label>{t("role")}</Label>

        <Select
          value={form.watch("role")}
          onValueChange={(value) =>
            form.setValue("role", value as UserRole, {
              shouldValidate: true,
              shouldDirty: true,
            })
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

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
        <Label
          htmlFor="edit-user-active"
          className="text-foreground"
        >
          {tCommon("active")}
        </Label>

        <Switch
          id="edit-user-active"
          checked={form.watch("isActive")}
          onCheckedChange={(value) =>
            form.setValue("isActive", value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          disabled={isPending}
        />
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-user-password">
          {t("newPassword")}
        </Label>

        <div className="relative">
          <Input
            id="edit-user-password"
            type={showNewPassword ? "text" : "password"}
            className="pe-10"
            {...form.register("newPassword")}
            disabled={isPending}
          />

          <button
            type="button"
            onClick={() =>
              setShowNewPassword((prev) => !prev)
            }
            disabled={isPending}
            className="absolute inset-e-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
            aria-label={
              showNewPassword
                ? "Hide new password"
                : "Show new password"
            }
            title={
              showNewPassword
                ? "Hide new password"
                : "Show new password"
            }
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {newPasswordError && (
          <p className="text-xs text-destructive">
            {tAuth(
              newPasswordError.split(".").pop() as never,
            )}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-user-confirm-password">
          {t("confirmNewPassword")}
        </Label>

        <div className="relative">
          <Input
            id="edit-user-confirm-password"
            type={
              showConfirmPassword ? "text" : "password"
            }
            className="pe-10"
            {...form.register("confirmNewPassword")}
            disabled={isPending}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            disabled={isPending}
            className="absolute inset-e-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            title={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {confirmPasswordError && (
          <p className="text-xs text-destructive">
            {tAuth(
              confirmPasswordError.split(".").pop() as never,
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