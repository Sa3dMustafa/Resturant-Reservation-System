"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { reservationsService } from "@/lib/services/reservations.service";

import {
  tablesService,
  type TablesListParams,
} from "@/lib/services/tables.service";

import type {
  CreateReservationRequest,
  ReservationsQueryParams,
  UpdateReservationStatusRequest,
} from "@/types";

export const reservationsKeys = {
  all: ["reservations"] as const,

  list: (params: ReservationsQueryParams) =>
    [...reservationsKeys.all, "list", params] as const,

  detail: (id: string) =>
    [...reservationsKeys.all, "detail", id] as const,
};

export function useReservations(
  params: ReservationsQueryParams = {},
) {
  return useQuery({
    queryKey: reservationsKeys.list(params),
    queryFn: () => reservationsService.list(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useReservation(id: string | undefined) {
  return useQuery({
    queryKey: reservationsKeys.detail(id ?? ""),
    queryFn: () => reservationsService.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservationRequest) =>
      reservationsService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReservationStatusRequest;
    }) => reservationsService.updateStatus(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
}

export function useTables(params: TablesListParams) {
  return useQuery({
    queryKey: ["tables", params],
    queryFn: () => tablesService.list(params),
  });
}

export function useActiveTimeSlots() {
  return useQuery({
    queryKey: ["time-slots"],
    queryFn: () => tablesService.timeSlots(),
    staleTime: 5 * 60_000,
  });
}