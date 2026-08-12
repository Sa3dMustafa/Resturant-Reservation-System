"use client";

import { useTranslations } from "next-intl";
import { UsersList } from "@/features/users/UsersList";

export default function UsersAdminPage() {
  const t = useTranslations("user");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-primary">{t("title")}</h1>
      <UsersList />
    </div>
  );
}
