"use client";

import { useTranslations } from "next-intl";

import {
  Pencil,
  Trash2,
} from "lucide-react";

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

import type { AdminUser } from "@/types";

interface UsersTableProps {
  users: AdminUser[];
  isDeleting: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UsersTable({
  users,
  isDeleting,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {tCommon("name")}
          </TableHead>

          <TableHead>
            {t("username")}
          </TableHead>

          <TableHead>
            {t("role")}
          </TableHead>

          <TableHead>
            {tCommon("status")}
          </TableHead>

          <TableHead>
            {t("deleted")}
          </TableHead>

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

            <TableCell>
              <Badge
                variant={
                  user.isDeleted
                    ? "destructive"
                    : "muted"
                }
              >
                {user.isDeleted
                  ? t("deleted")
                  : t("notDeleted")}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(user)}
                  disabled={
                    isDeleting ||
                    user.isDeleted
                  }
                  title={
                    user.isDeleted
                      ? t("cannotEditDeleted")
                      : tCommon("edit")
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(user)}
                  disabled={
                    isDeleting ||
                    user.isDeleted
                  }
                  title={
                    user.isDeleted
                      ? t("alreadyDeleted")
                      : t("delete")
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}