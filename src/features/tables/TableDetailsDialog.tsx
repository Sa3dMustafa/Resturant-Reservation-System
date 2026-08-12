"use client";

import { useTranslations } from "next-intl";
import {
  CalendarDays,
  Clock3,
  Hash,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowsSkeleton } from "@/components/shared/LoadingSkeleton";
import { TableStatusBadge } from "@/components/shared/StatusBadge";

import { useTableDetails } from "@/hooks/useTablesAdmin";

import type { RestaurantTable } from "@/types";

interface TableDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: RestaurantTable | null;
}

function getReservationStatusClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400";

    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400";

    case "ARRIVED":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-400";

    case "COMPLETED":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getReservationStatusLabel(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";

    case "PENDING":
      return "Pending";

    case "ARRIVED":
      return "Arrived";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

export function TableDetailsDialog({
  open,
  onOpenChange,
  table,
}: TableDetailsDialogProps) {
  const t = useTranslations("table");
  const tCommon = useTranslations("common");

  const {
    data: tableDetails,
    isLoading,
    isError,
    refetch,
  } = useTableDetails(table?.id ?? null);

  const currentTable = tableDetails ?? table;
  const reservations = currentTable?.reservations ?? [];

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-4xl">
        {isLoading ? (
          <div className="p-6">
            <TableRowsSkeleton rows={6} cols={2} />
          </div>
        ) : isError ? (
          <div className="p-6">
            <ErrorState onRetry={refetch} />
          </div>
        ) : !currentTable ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {tCommon("somethingWentWrong")}
          </div>
        ) : (
          <>
            <DialogHeader className="border-b bg-muted/20 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {currentTable.tableNumber}
                  </div>

                  <div>
                    <DialogTitle className="text-xl font-bold">
                      {t("tableDetails")}
                    </DialogTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentTable.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 font-semibold"
                  >
                    #{currentTable.tableNumber}
                  </Badge>

                  <TableStatusBadge status={currentTable.status} />
                </div>
              </div>
            </DialogHeader>

            <div className="max-h-[calc(92vh-105px)] overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Card className="border-border/60 p-4 shadow-none">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <Hash className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t("tableNumber")}
                        </p>

                        <p className="mt-1 font-semibold">
                          #{currentTable.tableNumber}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border/60 p-4 shadow-none">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <Users className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t("capacity")}
                        </p>

                        <p className="mt-1 font-semibold">
                          {currentTable.capacity} {t("seats")}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border/60 p-4 shadow-none">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t("area")}
                        </p>

                        <p className="mt-1 truncate font-semibold">
                          {currentTable.position}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {t("reservations")}
                        </h3>

                        <Badge variant="default">{reservations.length}</Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("reservationsForDate")}
                      </p>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />

                      <span className="text-sm font-medium">{today}</span>
                    </div>
                  </div>

                  {reservations.length === 0 ? (
                    <Card className="border-dashed p-10 shadow-none">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 rounded-full bg-muted p-3">
                          <CalendarDays className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h4 className="font-semibold">{t("noReservations")}</h4>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                          {t("noReservationsDescription")}
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((reservation) => {
                        const clientName =
                          reservation.client?.name ?? t("unknownClient");

                        const clientInitial = clientName
                          .charAt(0)
                          .toUpperCase();

                        const timeRange =
                          reservation.slots?.length > 0
                            ? reservation.slots
                                .map(
                                  (slot) =>
                                    `${slot.startTime} - ${slot.endTime}`,
                                )
                                .join(", ")
                            : "-";

                        return (
                          <Card
                            key={reservation.id}
                            className="overflow-hidden border-border/70 shadow-sm"
                          >
                            <div className="border-b bg-muted/20 px-4 py-4">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {clientInitial}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate font-semibold">
                                      {clientName}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                      <span>{t("reservationCode")}</span>

                                      <span className="font-medium text-foreground">
                                        {reservation.reservationCode}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getReservationStatusClass(reservation.status)}`}
                                >
                                  {getReservationStatusLabel(
                                    reservation.status,
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border bg-background p-3.5">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />

                                    <span className="text-xs font-medium">
                                      {t("guests")}
                                    </span>
                                  </div>

                                  <p className="mt-2 font-semibold">
                                    {reservation.guestCount} {t("people")}
                                  </p>
                                </div>

                                <div className="rounded-xl border bg-background p-3.5">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />

                                    <span className="text-xs font-medium">
                                      {t("phone")}
                                    </span>
                                  </div>

                                  <p className="mt-2 truncate font-semibold">
                                    {reservation.client?.phoneNumber ?? "-"}
                                  </p>
                                </div>

                                <div className="rounded-xl border bg-background p-3.5">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock3 className="h-4 w-4" />

                                    <span className="text-xs font-medium">
                                      {t("time")}
                                    </span>
                                  </div>

                                  <p className="mt-2 font-semibold">
                                    {timeRange}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {reservation.client?.email && (
                                  <div className="rounded-xl border bg-muted/20 p-3.5">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Mail className="h-4 w-4" />

                                      <span className="text-xs font-medium">
                                        {t("email")}
                                      </span>
                                    </div>

                                    <p className="mt-2 truncate text-sm font-medium">
                                      {reservation.client.email}
                                    </p>
                                  </div>
                                )}

                                {reservation.slots?.length > 0 && (
                                  <div className="rounded-xl border bg-muted/20 p-3.5">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Clock3 className="h-4 w-4" />

                                      <span className="text-xs font-medium">
                                        {t("timeSlots")}
                                      </span>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {reservation.slots.map((slot) => (
                                        <Badge
                                          key={slot.id}
                                          variant="default"
                                          className="gap-1.5 px-2.5 py-1"
                                        >
                                          <span>{slot.startTime}</span>

                                          <span className="text-muted-foreground">
                                            →
                                          </span>

                                          <span>{slot.endTime}</span>
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {reservation.specialRequests && (
                                <div className="mt-4 rounded-xl border border-dashed bg-muted/20 p-4">
                                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                                    {t("specialRequests")}
                                  </p>

                                  <p className="text-sm leading-6">
                                    {reservation.specialRequests}
                                  </p>
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
