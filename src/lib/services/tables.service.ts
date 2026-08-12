import { apiClient } from "@/lib/api/client";

import type {
  CreateTableRequest,
  RestaurantTable,
  TimeSlot,
  UpdateTableRequest,
  UpdateTableStatusRequest,
} from "@/types";

export interface TablesListParams {
  date: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface TablesListResponse {
  meta?: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };

  reservations?: RestaurantTable[];

  tables?: RestaurantTable[];
}

export const tablesService = {
  list: async (
    params: TablesListParams,
  ): Promise<RestaurantTable[]> => {
    const q = new URLSearchParams();

    q.set("date", params.date);

    if (params.page !== undefined) {
      q.set("page", String(params.page));
    }

    if (params.limit !== undefined) {
      q.set("limit", String(params.limit));
    }

    if (params.search) {
      q.set("search", params.search);
    }

    if (params.status) {
      q.set("status", params.status);
    }

    const data = await apiClient.get<TablesListResponse>(
      `/tables?${q.toString()}`,
    );

    if (Array.isArray(data.tables)) {
      return data.tables;
    }

    if (Array.isArray(data.reservations)) {
      return data.reservations;
    }

    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[tablesService.list] Unexpected /tables response shape:",
        data,
      );
    }

    throw new Error(
      "Unexpected response shape from GET /tables. Expected tables[] or reservations[].",
    );
  },

  timeSlots: async (): Promise<TimeSlot[]> => {
    const data = await apiClient.get<{
      slots: TimeSlot[];
    }>("/tables/time-slots");

    return data.slots;
  },

  getById: async (
    id: string,
    date: string,
  ): Promise<RestaurantTable | null> => {
    const data = await apiClient.get<{
      table: RestaurantTable | null;
    }>(
      `/tables/${id}?date=${encodeURIComponent(date)}`,
    );

    return data.table;
  },

  updateStatus: async (
    id: string,
    payload: UpdateTableStatusRequest,
  ): Promise<RestaurantTable> => {
    const data = await apiClient.post<
      {
        table?: RestaurantTable;
      } & Partial<RestaurantTable>
    >(`/tables/${id}/status`, payload);

    return (data.table ?? data) as RestaurantTable;
  },

  create: async (
    payload: CreateTableRequest,
  ): Promise<RestaurantTable> => {
    const data = await apiClient.post<
      {
        table?: RestaurantTable;
      } & Partial<RestaurantTable>
    >("/admin/tables", payload);

    return (data.table ?? data) as RestaurantTable;
  },

  update: async (
    id: string,
    payload: UpdateTableRequest,
  ): Promise<RestaurantTable> => {
    const data = await apiClient.patch<
      {
        table?: RestaurantTable;
      } & Partial<RestaurantTable>
    >(`/admin/tables/${id}`, payload);

    return (data.table ?? data) as RestaurantTable;
  },

  remove: (id: string) =>
    apiClient.delete(`/admin/tables/${id}`),
};