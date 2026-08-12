"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { tablesService } from "@/lib/services/tables.service";

import type {
  CreateTableRequest,
  UpdateTableRequest,
  UpdateTableStatusRequest,
} from "@/types";

export function useTablesList(
  date: string = format(new Date(), "yyyy-MM-dd"),
) {
  return useQuery({
    queryKey: ["tables", { date }],
    queryFn: () => tablesService.list({ date }),
  });
}

export function useTableDetails(
  id: string | null,
  date: string = format(new Date(), "yyyy-MM-dd"),
) {
  return useQuery({
    queryKey: ["table", id, { date }],
    queryFn: () => tablesService.getById(id!, date),
    enabled: !!id,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTableRequest) =>
      tablesService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTableRequest;
    }) => tablesService.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tablesService.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTableStatusRequest;
    }) => tablesService.updateStatus(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });
    },
  });
}