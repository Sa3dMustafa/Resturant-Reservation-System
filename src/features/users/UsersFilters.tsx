"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SearchInput } from "@/components/shared/SearchInput";

import type { UserRole } from "@/types";

interface UsersFiltersProps {
  search: string;
  role: UserRole | "ALL";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | "ALL") => void;
  onCreate: () => void;
}

export function UsersFilters({
  search,
  role,
  onSearchChange,
  onRoleChange,
  onCreate,
}: UsersFiltersProps) {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          className="sm:max-w-xs"
        />

        <Select
          value={role}
          onValueChange={(value) =>
            onRoleChange(
              value as UserRole | "ALL",
            )
          }
        >
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

      <Button onClick={onCreate}>
        {t("createAccount")}
      </Button>
    </div>
  );
}