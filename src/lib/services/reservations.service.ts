import { apiClient } from "@/lib/api/client";

import type {
  CreatedReservation,
  CreateReservationRequest,
  PaginationMeta,
  ReservationDetail,
  ReservationListItem,
  ReservationStatusUpdateResult,
  ReservationsQueryParams,
  UpdateReservationStatusRequest,
} from "@/types";

function buildQuery(params: ReservationsQueryParams = {}) {
  const query = new URLSearchParams();

  if (params.date) {
    query.set("date", params.date);
  }

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.tableId) {
    query.set("tableId", params.tableId);
  }

  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    query.set("sortOrder", params.sortOrder);
  }

  const qs = query.toString();

  return qs ? `?${qs}` : "";
}

export interface ReservationsListResult {
  reservations: ReservationListItem[];
  meta: PaginationMeta;
}

export const reservationsService = {
  async create(payload: CreateReservationRequest) {
    const data = await apiClient.post<{
      reservation: CreatedReservation;
    }>("/reservations", payload, {
      skipAuth: true,
    });

    return data.reservation;
  },

  async list(
    params: ReservationsQueryParams = {},
  ): Promise<ReservationsListResult> {
    const data = await apiClient.get<{
      reservations: ReservationListItem[];
      meta: PaginationMeta;
    }>(`/reservations${buildQuery(params)}`);

    console.log("Reservations API response:", data);

    return {
      reservations: data?.reservations ?? [],
      meta: data?.meta ?? {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 8,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  },

  async getById(id: string) {
    const data = await apiClient.get<{
      reservation: ReservationDetail;
    }>(`/reservations/${id}`);

    return data.reservation;
  },

  async updateStatus(
    id: string,
    payload: UpdateReservationStatusRequest,
  ) {
    const data = await apiClient.patch<{
      reservation: ReservationStatusUpdateResult;
    }>(`/reservations/${id}/status`, payload);

    return data.reservation;
  },
};