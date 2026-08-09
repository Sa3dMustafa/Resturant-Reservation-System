"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { reservationsService } from "@/lib/services/reservations.service";
import { tablesService } from "@/lib/services/tables.service";

export function useDashboardStats() {
  const today = format(new Date(), "yyyy-MM-dd");

  const reservationsToday = useQuery({
    queryKey: ["dashboard-stats", "reservations-today", today],
    queryFn: () =>
      reservationsService.list({
        date: today,
        limit: 100,
      }),
  });

  const tables = useQuery({
    queryKey: ["dashboard-stats", "tables", today],
    queryFn: () => tablesService.list({ date: today }),
  });

  const tablesData = Array.isArray(tables.data) ? tables.data : [];

  const reservationsData = reservationsToday.data?.reservations ?? [];

  const availableTables = tablesData.filter(
    (table) => table.status === "AVAILABLE",
  ).length;

  const busyTables = tablesData.filter(
    (table) => table.status === "RESERVED" || table.status === "OCCUPIED",
  ).length;

  // const noShowsToday = reservationsData.filter(
  //   (reservation) => reservation.status === "NO_SHOW",
  // ).length;

  return {
    today,

    reservationsTodayCount: reservationsToday.data?.meta?.total ?? 0,

    availableTables,

    busyTables,

    // noShowsToday,

    isLoading: reservationsToday.isLoading || tables.isLoading,

    isError: reservationsToday.isError || tables.isError,

    refetch: () => {
      reservationsToday.refetch();
      tables.refetch();
    },
  };
}
