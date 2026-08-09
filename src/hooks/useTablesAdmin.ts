"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { tablesService } from "@/lib/services/tables.service";
import type { CreateTableRequest, UpdateTableRequest, UpdateTableStatusRequest } from "@/types";

// GET /tables requires a `date` query param. Table management (status,
// capacity, position) isn't really date-scoped, but the reservations
// nested under each table are — defaulting to "today" is the sensible
// choice for the admin Tables screen and dashboard panels.
export function useTablesList(date: string = format(new Date(), "yyyy-MM-dd")) {
  return useQuery({
    queryKey: ["tables", { date }],
    queryFn: () => tablesService.list({ date }),
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTableRequest) => tablesService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTableRequest }) =>
      tablesService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tablesService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTableStatusRequest }) =>
      tablesService.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
