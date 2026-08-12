"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { ReservationStatusBadge } from "@/components/shared/StatusBadge";

import {
  useReservation,
  useUpdateReservationStatus,
} from "@/hooks/useReservations";

import { ApiRequestError } from "@/lib/api/client";

import type { ReservationListItem } from "@/types";

export function ReservationDetailsDialog({
  reservation,
  open,
  onOpenChange,
}: {
  reservation: ReservationListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const [showCancelForm, setShowCancelForm] = useState(false);

  const [cancellationReason, setCancellationReason] = useState("");

  const mutation = useUpdateReservationStatus();

  // The list row only has a condensed shape.
  // Fetch the full reservation details by ID.
  const {
    data: detail,
    isLoading: detailLoading,
    isError: detailError,
  } = useReservation(reservation?.id);

  if (!reservation) return null;

  const status = detail?.status ?? reservation.status;

  const updateStatus = (
    statusValue: "CONFIRMED" | "CANCELLED" | "COMPLETED",
    reason?: string,
  ) => {
    mutation.mutate(
      {
        id: reservation.id,
        payload: {
          status: statusValue,
          cancellationReason: reason,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setShowCancelForm(false);
          setCancellationReason("");
        },

        onError: (err) => {
          const message =
            err instanceof ApiRequestError
              ? err.message
              : tCommon("somethingWentWrong");

          toast.error(message);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);

        if (!o) {
          setShowCancelForm(false);
          setCancellationReason("");
        }
      }}
    >
      <DialogContent className="max-w-md border-border bg-background p-5">
        {/* Header */}
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-base font-semibold">
            {t("title")}{" "}
            <span className="text-muted-foreground">
              #{reservation.table?.tableNumber ?? ""}
            </span>
          </DialogTitle>

          {/* Status */}
          <div className="flex justify-center">
            <ReservationStatusBadge status={status} />
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {/* Reservation Details */}
          <div className="rounded-xl border border-border p-4">
            <div className="space-y-3">
              {/* Name */}
              <Row label={tCommon("name")} value={reservation.client.name} />

              {/* Date */}
              <Row
                label={tCommon("date")}
                value={
                  detail?.date
                    ? new Date(detail.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : reservation.slots.length > 0 && reservation.slots[0].date
                      ? new Date(reservation.slots[0].date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"
                }
              />

              {/* Time */}
              <Row
                label={tCommon("time")}
                value={
                  reservation.slots.length > 0
                    ? `${reservation.slots[0].startTime} - ${
                        reservation.slots[reservation.slots.length - 1].endTime
                      }`
                    : "—"
                }
              />

              {/* Table */}
              <Row
                label={t("table")}
                value={String(reservation.table?.tableNumber ?? "—")}
              />

              {/* Guests */}
              <Row label={t("guests")} value={String(reservation.guestCount)} />

              {/* Loading / Details */}
              {detailLoading ? (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : detailError ? (
                <p className="pt-1 text-xs text-muted-foreground">
                  {tCommon("errors.server")} — {t("reservationCode")},{" "}
                  {tCommon("phone")}, {tCommon("email")} {tCommon("noResults")}.
                </p>
              ) : detail ? (
                <>
                  {/* Phone */}
                  <Row
                    label={tCommon("phone")}
                    value={detail.client.phoneNumber}
                  />

                  {/* Email */}
                  {detail.client.email && (
                    <Row label={tCommon("email")} value={detail.client.email} />
                  )}

                  {/* Special Requests */}
                  {detail.specialRequests && (
                    <Row
                      label={t("specialRequests")}
                      value={detail.specialRequests}
                    />
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* Reservation Code */}
          {!detailLoading && detail?.reservationCode && (
            <div className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>👾</span>
                {t("reservationCode")}
              </div>

              <div className="flex justify-center">
                <span className="rounded-md bg-primary px-4 py-2 font-mono text-sm font-semibold text-primary-foreground">
                  {detail.reservationCode}
                </span>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          {showCancelForm && (
            <div className="space-y-1.5">
              <Textarea
                placeholder={t("cancellationReason")}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>
          )}

          {/* Actions */}
          {(status === "PENDING" || status === "CONFIRMED") && (
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              {showCancelForm ? (
                <>
                  {/* Back */}
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCancelForm(false)}
                    disabled={mutation.isPending}
                  >
                    {tCommon("back")}
                  </Button>

                  {/* Confirm Cancellation */}
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={!cancellationReason || mutation.isPending}
                    onClick={() =>
                      updateStatus("CANCELLED", cancellationReason)
                    }
                  >
                    {t("cancelReservation")}
                  </Button>
                </>
              ) : (
                <>
                  {/* Cancel */}
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowCancelForm(true)}
                    disabled={mutation.isPending}
                  >
                    {t("cancelReservation")}
                  </Button>

                  {/* Confirm */}
                  {status === "PENDING" && (
                    <Button
                      className="flex-1"
                      onClick={() => updateStatus("CONFIRMED")}
                      disabled={mutation.isPending}
                    >
                      {t("status.CONFIRMED")}
                    </Button>
                  )}

                  {/* Complete */}
                  {status === "CONFIRMED" && (
                    <Button
                      className="flex-1"
                      onClick={() => updateStatus("COMPLETED")}
                      disabled={mutation.isPending}
                    >
                      {t("status.COMPLETED")}
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="shrink-0 text-muted-foreground">{label}</span>

      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
