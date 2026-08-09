"use client";

import { useTranslations } from "next-intl";
import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowsSkeleton } from "@/components/shared/LoadingSkeleton";
import { TableStatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { useTablesList } from "@/hooks/useTablesAdmin";
import type { RestaurantTable, TableStatus } from "@/types";
import { useMemo, useState } from "react";

export function SimpleTablesList({
  statusFilter,
  emptyTitle,
  emptyDescription,
  onView,
}: {
  statusFilter?: TableStatus;
  emptyTitle: string;
  emptyDescription: string;
  onView?: (table: RestaurantTable) => void;
}) {
  const t = useTranslations("table");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useTablesList();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (statusFilter) list = list.filter((tb) => tb.status === statusFilter);
    if (search) list = list.filter((tb) => String(tb.tableNumber).includes(search));
    return list;
  }, [data, statusFilter, search]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border p-4">
        <SearchInput value={search} onChange={setSearch} className="sm:max-w-xs" />
      </div>

      {isLoading ? (
        <TableRowsSkeleton rows={6} cols={5} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={LayoutGrid} title={emptyTitle} description={emptyDescription} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableNumber")}</TableHead>
              <TableHead>{t("area")}</TableHead>
              <TableHead>{t("capacity")}</TableHead>
              <TableHead>{tCommon("status")}</TableHead>
              <TableHead className="text-end">{tCommon("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.tableNumber}</TableCell>
                <TableCell className="text-muted-foreground">{table.position}</TableCell>
                <TableCell>
                  {table.capacity} {t("seats")}
                </TableCell>
                <TableCell>
                  <TableStatusBadge status={table.status} />
                </TableCell>
                <TableCell className="text-end">
                  <Button size="sm" onClick={() => onView?.(table)}>
                    {tCommon("view")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
