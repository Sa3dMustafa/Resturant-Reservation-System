"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CalendarCheck2,
  CheckCircle2,
  PartyPopper,
  ShieldAlert,
} from "lucide-react";
import { DashboardGreeting } from "@/features/dashboard/DashboardGreeting";
import { StatCard } from "@/features/dashboard/StatCard";
import { StatCardsSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationsTable } from "@/features/reservations/ReservationsTable";
import { SimpleTablesList } from "@/features/tables/SimpleTablesList";
import { useDashboardStats } from "@/hooks/useDashboardStats";

type Panel = "reservationsToday" | "availableTables" | "busyTables" | "noShows";

export default function DashboardHomePage() {
  const t = useTranslations("dashboard");
  const [panel, setPanel] = useState<Panel>("reservationsToday");
  const stats = useDashboardStats();

  return (
    <div className="space-y-6">
      <DashboardGreeting />

      {stats.isLoading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label={t("stats.reservationsToday")}
            value={stats.reservationsTodayCount}
            icon={CalendarCheck2}
            active={panel === "reservationsToday"}
            onClick={() => setPanel("reservationsToday")}
          />
          <StatCard
            label={t("stats.availableTables")}
            value={stats.availableTables}
            icon={CheckCircle2}
            active={panel === "availableTables"}
            onClick={() => setPanel("availableTables")}
          />
          <StatCard
            label={t("stats.busyTables")}
            value={stats.busyTables}
            icon={ShieldAlert}
            active={panel === "busyTables"}
            onClick={() => setPanel("busyTables")}
          />
          <StatCard
            label={t("stats.noShowsToday")}
            value={"-"}//stats.noShowsToday
            icon={PartyPopper}
            active={panel === "noShows"}
            onClick={() => setPanel("noShows")}
          />
        </div>
      )}

      {panel === "reservationsToday" && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold">
            {t("upcomingReservations")}
          </h2>
          <ReservationsTable baseFilters={{ date: stats.today }} />
        </section>
      )}

      {panel === "availableTables" && (
        <SimpleTablesList
          statusFilter="AVAILABLE"
          emptyTitle={t("emptyAvailable.title")}
          emptyDescription={t("emptyAvailable.description")}
        />
      )}

      {panel === "busyTables" && (
        <SimpleTablesList
          statusFilter="OCCUPIED"
          emptyTitle={t("emptyBusy.title")}
          emptyDescription={t("emptyBusy.description")}
        />
      )}

      {panel === "noShows" && (
        <Card>
          <CardHeader>
            <CardTitle className="sr-only">{t("stats.noShowsToday")}</CardTitle>
          </CardHeader>
          <EmptyState
            icon={PartyPopper}
            title={t("emptyNoShows.title")}
            description={t("emptyNoShows.description")}
          />
        </Card>
      )}
    </div>
  );
}
