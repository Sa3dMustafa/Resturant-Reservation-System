"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowsSkeleton } from "@/components/shared/LoadingSkeleton";
import { TableStatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDeleteTable, useTablesList } from "@/hooks/useTablesAdmin";
import { ApiRequestError } from "@/lib/api/client";
import type { RestaurantTable } from "@/types";
import { TableFormDialog } from "./TableFormDialog";

export function TablesAdminList() {
  const t = useTranslations("table");
  const tCommon = useTranslations("common");
  const { data, isLoading, isError, refetch } = useTablesList();
  const deleteMutation = useDeleteTable();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [deletingTable, setDeletingTable] = useState<RestaurantTable | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    return data.filter((tb) => String(tb.tableNumber).includes(search));
  }, [data, search]);

  const handleDelete = () => {
    if (!deletingTable) return;
    deleteMutation.mutate(deletingTable.id, {
      onSuccess: () => setDeletingTable(null),
      onError: (err) => {
        const message = err instanceof ApiRequestError ? err.message : tCommon("somethingWentWrong");
        toast.error(message);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} className="sm:max-w-xs" />
        <Button onClick={() => { setEditingTable(null); setFormOpen(true); }}>{t("addTable")}</Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <TableRowsSkeleton rows={6} cols={5} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={LayoutGrid} title={t("empty.title")} description={t("empty.description")} />
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
                  <TableCell>{table.capacity} {t("seats")}</TableCell>
                  <TableCell><TableStatusBadge status={table.status} /></TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" onClick={() => { setEditingTable(table); setFormOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => setDeletingTable(table)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <TableFormDialog open={formOpen} onOpenChange={setFormOpen} table={editingTable} />
      <ConfirmDialog
        open={!!deletingTable}
        onOpenChange={(o) => !o && setDeletingTable(null)}
        title={t("deleteConfirm")}
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
