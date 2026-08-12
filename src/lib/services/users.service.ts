import { apiClient } from "@/lib/api/client";

import type {
  AdminUser,
  CreateUserRequest,
  PaginationMeta,
  UpdateUserRequest,
  UsersQueryParams,
} from "@/types";

export interface UsersListResponse {
  users: AdminUser[];
  meta: PaginationMeta;
}

function buildQuery(params: UsersQueryParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

export const usersService = {
  list: async (
    params: UsersQueryParams = {},
  ): Promise<UsersListResponse> => {
    return apiClient.get<UsersListResponse>(
      `/admin/users${buildQuery(params)}`,
    );
  },

  create: async (
    payload: CreateUserRequest,
  ): Promise<{ user: AdminUser }> => {
    return apiClient.post<{ user: AdminUser }>(
      "/admin/users",
      payload,
    );
  },

  update: async (
    id: string,
    payload: UpdateUserRequest,
  ): Promise<{ user: AdminUser }> => {
    return apiClient.patch<{ user: AdminUser }>(
      `/admin/users/${id}`,
      payload,
    );
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/admin/users/${id}`);
  },
};