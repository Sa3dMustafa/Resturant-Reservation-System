"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { profileSchema, type ProfileFormValues } from "@/schemas/auth.schema";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authService } from "@/lib/services/auth.service";
import { ApiRequestError } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";

export function ProfileForm() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const { user, refetchUser } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({ name: user.name, email: user.email ?? "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) => {
      const payload: Record<string, string> = { name: values.name };
      if (values.email) payload.email = values.email;
      if (values.newPassword) {
        payload.currentPassword = values.currentPassword ?? "";
        payload.newPassword = values.newPassword;
        payload.confirmNewPassword = values.confirmNewPassword ?? "";
      }
      return authService.updateMe(payload);
    },
    onSuccess: async () => {
      toast.success(tCommon("saveChanges"));
      await refetchUser();
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      form.setValue("confirmNewPassword", "");
    },
    onError: (err) => {
      const message = err instanceof ApiRequestError ? err.message : tCommon("somethingWentWrong");
      toast.error(message);
    },
  });

  if (!user) return null;

  return (
    <Card className="max-w-lg">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg">{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{tCommon("name")}</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label>{tCommon("email")}</Label>
            <Input type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{tCommon(form.formState.errors.email.message?.split(".").pop() as never)}</p>
            )}
          </div>

          <Separator className="my-2" />
          <p className="font-display text-sm font-semibold">{t("changePassword")}</p>

          <div className="space-y-1.5">
            <Label>{t("currentPassword")}</Label>
            <Input type="password" {...form.register("currentPassword")} />
            {form.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">{tCommon(form.formState.errors.currentPassword.message as never)}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>{tCommon("optional")} — {tAuth("password")}</Label>
            <Input type="password" placeholder="••••••••" {...form.register("newPassword")} />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-destructive">{tAuth(form.formState.errors.newPassword.message?.split(".").pop() as never)}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>{t("changePassword")} ({tCommon("confirm")})</Label>
            <Input type="password" {...form.register("confirmNewPassword")} />
            {form.formState.errors.confirmNewPassword && (
              <p className="text-xs text-destructive">{tAuth(form.formState.errors.confirmNewPassword.message?.split(".").pop() as never)}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>{tCommon("saveChanges")}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
