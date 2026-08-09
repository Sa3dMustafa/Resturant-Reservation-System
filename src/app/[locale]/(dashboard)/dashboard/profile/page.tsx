"use client";

import { useTranslations } from "next-intl";
import { ProfileForm } from "@/features/profile/ProfileForm";

export default function ProfilePage() {
  const t = useTranslations("profile");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-primary">{t("title")}</h1>
      <ProfileForm />
    </div>
  );
}
