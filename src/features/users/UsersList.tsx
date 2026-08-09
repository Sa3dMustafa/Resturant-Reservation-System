"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Users as UsersIcon, Pencil } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableRowsSkeleton } from "@/components/shared/LoadingSkeleton";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";

import { useUsersList } from "@/hooks/useUsers";

import type {
  AdminUser,
  UserRole,
  UsersQueryParams,
} from "@/types";

import { UserFormDialog } from "./UserFormDialog";

export function UsersList() {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const params: UsersQueryParams = {
    page,
    limit: 8,
    search: search || undefined,
    role: role === "ALL" ? undefined : role,
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useUsersList(params);

  // IMPORTANT:
  // apiClient already unwraps `data`.
  //
  // Actual response after apiClient:
  //
  // {
  //   users: AdminUser[],
  //   meta: PaginationMeta
  // }
  //
  // NOT:
  //
  // {
  //   users: {
  //     users: AdminUser[],
  //     meta: PaginationMeta
  //   }
  // }

  const users = data?.users ?? [];
  const meta = data?.meta;

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole | "ALL");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            className="sm:max-w-xs"
          />

          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={t("role")} />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                {tCommon("clearAll")}
              </SelectItem>

              <SelectItem value="ADMIN">
                {t("roles.ADMIN")}
              </SelectItem>

              <SelectItem value="STAFF">
                {t("roles.STAFF")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCreate}>
          {t("createAccount")}
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <TableRowsSkeleton rows={6} cols={5} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={t("empty.title")}
            description={t("empty.description")}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon("name")}</TableHead>
                  <TableHead>{t("username")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{tCommon("status")}</TableHead>
                  <TableHead className="text-end">
                    {tCommon("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {user.username}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "default"
                            : "muted"
                        }
                      >
                        {t(`roles.${user.role}`)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          user.isActive
                            ? "success"
                            : "muted"
                        }
                      >
                        {user.isActive
                          ? tCommon("active")
                          : tCommon("inactive")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-end">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
        onOpenChange={setFormOpen}
        user={editingUser}
      />
    </div>
  );
}