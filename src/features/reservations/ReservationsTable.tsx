"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { CalendarX2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowsSkeleton } from "@/components/shared/LoadingSkeleton";
import { Pagination } from "@/components/shared/Pagination";
import { ReservationStatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";

import { useReservations } from "@/hooks/useReservations";

import type {
  ReservationListItem,
  ReservationsQueryParams,
} from "@/types";

import { ReservationDetailsDialog } from "./ReservationDetailsDialog";
import { ReservationFiltersPopover } from "./ReservationFiltersPopover";

export function ReservationsTable({
  baseFilters,
  showToolbar = true,
}: {
  baseFilters?: Partial<ReservationsQueryParams>;
  showToolbar?: boolean;
}) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<
    Partial<ReservationsQueryParams>
  >(() => ({
    date: format(new Date(), "yyyy-MM-dd"),
  }));

  const [selected, setSelected] =
    useState<ReservationListItem | null>(null);

  const params: ReservationsQueryParams = useMemo(
    () => ({
      page,
      limit: 8,
      search: search.trim() || undefined,
      ...filters,
      ...baseFilters,
      date:
        baseFilters?.date ??
        filters.date ??
        format(new Date(), "yyyy-MM-dd"),
    }),
    [page, search, filters, baseFilters],
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useReservations(params);

  /**
   * reservationsService.list() returns:
   *
   * {
   *   reservations: ReservationListItem[],
   *   meta: PaginationMeta
   * }
   */
  const reservations = data?.reservations ?? [];
  const meta = data?.meta;

  console.log("ReservationsTable params:", params);
  console.log("ReservationsTable data:", data);
  console.log("ReservationsTable reservations:", reservations);
  console.log("ReservationsTable meta:", meta);

  return (
    <Card>
      {showToolbar && (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            className="sm:max-w-xs"
          />

          <ReservationFiltersPopover
            filters={filters}
            onChange={(nextFilters) => {
              setFilters(nextFilters);
              setPage(1);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <TableRowsSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title={t("emptyDay.title")}
          description={t("emptyDay.description")}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon("name")}</TableHead>
                  <TableHead>{tCommon("time")}</TableHead>
                  <TableHead>{t("table")}</TableHead>
                  <TableHead>{t("guests")}</TableHead>
                  <TableHead>{tCommon("status")}</TableHead>
                  <TableHead className="text-end">
                    {tCommon("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody
                className={isFetching ? "opacity-60" : undefined}
              >
                {reservations.map((reservation) => {
                  const firstSlot = reservation.slots?.[0];

                  const lastSlot =
                    reservation.slots?.[
                      reservation.slots.length - 1
                    ];

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.client?.name ?? "—"}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {firstSlot && lastSlot
                          ? `${firstSlot.startTime} - ${lastSlot.endTime}`
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {reservation.table?.tableNumber != null
                          ? `T-${String(
                              reservation.table.tableNumber,
                            ).padStart(2, "0")}`
                          : "—"}
                      </TableCell>

                      <TableCell>
                        {reservation.guestCount}
                      </TableCell>

                      <TableCell>
                        <ReservationStatusBadge
                          status={reservation.status}
                        />
                      </TableCell>

                      <TableCell className="text-end">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setSelected(reservation)}
                        >
                          {tCommon("view")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {meta && meta.totalPages > 1 && (
            <Pagination
              meta={meta}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ReservationDetailsDialog
        reservation={selected}
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
      />
    </Card>
  );
}