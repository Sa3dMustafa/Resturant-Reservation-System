"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { usersService } from "@/lib/services/users.service";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  UsersQueryParams,
} from "@/types";

export const usersKeys = {
  all: ["users"] as const,

  list: (params: UsersQueryParams) =>
    [...usersKeys.all, "list", params] as const,

  detail: (id: string) =>
    [...usersKeys.all, "detail", id] as const,
};

export function useUsersList(params: UsersQueryParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) =>
      usersService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserRequest;
    }) => usersService.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },

  });
}