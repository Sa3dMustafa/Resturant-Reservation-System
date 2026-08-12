"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  loginSchema,
  type LoginFormValues,
} from "@/schemas/auth.schema";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "@/i18n/navigation";
import { ApiRequestError } from "@/lib/api/client";

export function LoginForm() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      await login(values);

      toast.success(t("loginSuccess"));

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 401 || err.status === 400) {
          setServerError(t("errors.invalidCredentials"));
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError(tCommon("errors.network"));
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-6"
    >
      <div>
        <h1 className="font-display text-3xl font-semibold">
          {t("welcomeBack")}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("loginSubtitle")}
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <div className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <Label htmlFor="username">
            {t("username")}
          </Label>

          <Input
            id="username"
            type="text"
            autoComplete="username"
            {...form.register("username")}
          />

          {form.formState.errors.username && (
            <p className="text-xs text-destructive">
              {t(
                form.formState.errors.username.message
                  ?.split(".")
                  .pop() as never,
              )}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">
            {t("password")}
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="pe-10"
              {...form.register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-e-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              title={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {form.formState.errors.password && (
            <p className="text-xs text-destructive">
              {t(
                form.formState.errors.password.message
                  ?.split(".")
                  .pop() as never,
              )}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? t("loggingIn")
          : t("login")}
      </Button>
    </form>
  );
}