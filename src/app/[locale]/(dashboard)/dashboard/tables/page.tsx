"use client";

import { useTranslations } from "next-intl";
import { TablesAdminList } from "@/features/tables/TablesAdminList";

export default function TablesAdminPage() {
  const t = useTranslations("table");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-primary">{t("title")}</h1>
      <TablesAdminList />
    </div>
  );
}
