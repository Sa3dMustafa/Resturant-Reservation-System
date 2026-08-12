"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { toast } from "sonner";

import { Card } from "@/components/ui/card";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowsSkeleton } from "@/components/shared/LoadingSkeleton";
import { Pagination } from "@/components/shared/Pagination";

import {
  useDeleteUser,
  useUsersList,
} from "@/hooks/useUsers";

import { ApiRequestError } from "@/lib/api/client";

import type {
  AdminUser,
  UserRole,
  UsersQueryParams,
} from "@/types";

import { UserFormDialog } from "./UserFormDialog";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";
import { DeleteUserDialog } from "./DeleteUserDialog";

export function UsersList() {
  const t = useTranslations("user");

  const [page, setPage] = useState(1);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState<UserRole | "ALL">("ALL");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<AdminUser | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    deletingUser,
    setDeletingUser,
  ] = useState<AdminUser | null>(null);

  const params: UsersQueryParams = {
    page,
    limit: 8,
    search: search || undefined,
    role:
      role === "ALL"
        ? undefined
        : role,
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useUsersList(params);

  const deleteMutation =
    useDeleteUser();

  const users = data?.users ?? [];
  const meta = data?.meta;

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (
    value: UserRole | "ALL",
  ) => {
    setRole(value);
    setPage(1);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (
    user: AdminUser,
  ) => {
    if (user.isDeleted) {
      toast.error(
        t("cannotEditDeleted"),
      );

      return;
    }

    setEditingUser(user);
    setFormOpen(true);
  };

  const handleFormOpenChange = (
    open: boolean,
  ) => {
    if (!open) {
      setEditingUser(null);
    }

    setFormOpen(open);
  };

  const handleDeleteClick = (
    user: AdminUser,
  ) => {
    if (user.isDeleted) {
      toast.error(
        t("alreadyDeleted"),
      );

      return;
    }

    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogChange = (
    open: boolean,
  ) => {
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteDialogOpen(open);

    if (!open) {
      setDeletingUser(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) {
      return;
    }

    deleteMutation.mutate(
      deletingUser.id,
      {
        onSuccess: () => {
          toast.success(
            t("deletedSuccessfully"),
          );

          setDeleteDialogOpen(false);
          setDeletingUser(null);

          if (
            page > 1 &&
            users.length === 1
          ) {
            setPage((currentPage) =>
              Math.max(
                1,
                currentPage - 1,
              ),
            );
          }
        },

        onError: (error) => {
          const message =
            error instanceof ApiRequestError
              ? error.message
              : t("errors.deleteFailed");

          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <UsersFilters
        search={search}
        role={role}
        onSearchChange={
          handleSearchChange
        }
        onRoleChange={
          handleRoleChange
        }
        onCreate={handleCreate}
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <TableRowsSkeleton
            rows={6}
            cols={6}
          />
        ) : isError ? (
          <ErrorState
            onRetry={refetch}
          />
        ) : users.length === 0 ? (
          <EmptyState
            title={t("empty.title")}
            description={t(
              "empty.description",
            )}
          />
        ) : (
          <>
            <UsersTable
              users={users}
              isDeleting={
                deleteMutation.isPending
              }
              onEdit={handleEdit}
              onDelete={
                handleDeleteClick
              }
            />

            {meta && (
              <Pagination
                meta={meta}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </Card>

      <UserFormDialog
        open={formOpen}
        onOpenChange={
          handleFormOpenChange
        }
        user={editingUser}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        user={deletingUser}
        isPending={
          deleteMutation.isPending
        }
        onOpenChange={
          handleDeleteDialogChange
        }
        onConfirm={
          handleConfirmDelete
        }
      />
    </div>
  );
}