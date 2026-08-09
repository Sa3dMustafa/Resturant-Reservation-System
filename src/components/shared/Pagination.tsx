"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types";

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
      <span>{meta.total}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </Button>
        <span className="min-w-[5rem] text-center">
          {meta.page} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
