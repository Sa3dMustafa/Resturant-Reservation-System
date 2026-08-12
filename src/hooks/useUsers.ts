"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      usersService.delete(id),

    onSuccess: async (_, id) => {
      console.log("DELETE SUCCESS:", id);

      await queryClient.invalidateQueries({
        queryKey: usersKeys.all,
        refetchType: "active",
      });

      console.log("USERS CACHE INVALIDATED");
    },
  });
}