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

  const qs = query.toString();

  return qs ? `?${qs}` : "";
}

export const usersService = {
  // GET /admin/users
  //
  // apiClient already unwraps:
  // {
  //   success: true,
  //   data: {
  //     users: [...],
  //     meta: {...}
  //   }
  // }
  //
  // So this method returns:
  // {
  //   users: AdminUser[],
  //   meta: PaginationMeta
  // }
  list: (params: UsersQueryParams = {}) =>
    apiClient.get<UsersListResponse>(`/admin/users${buildQuery(params)}`),

  // POST /admin/users
  create: (payload: CreateUserRequest) =>
    apiClient.post<{ user: AdminUser }>("/admin/users", payload),

  // PATCH /admin/users/:id
  update: (id: string, payload: UpdateUserRequest) =>
    apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}`, payload),
};