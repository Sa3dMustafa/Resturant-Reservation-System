"use client";

import { useFormatter, useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth/AuthProvider";

import { DashboardMobileNav } from "./DashboardMobileNav";

export function DashboardGreeting() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();
  const format = useFormatter();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <DashboardMobileNav />

        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
            {t("greeting", { name: user?.name?.split(" ")[0] ?? "" })} 👋
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {format.dateTime(new Date(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}