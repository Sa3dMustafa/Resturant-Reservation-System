"use client";

import { useTranslations } from "next-intl";

export default function FooterContact() {
  const t = useTranslations("Footer");

  return (
    <div>
      <h3 className="mb-8 text-xl font-semibold text-primary">
        {t("contact.title")}
      </h3>

      <div className="space-y-5 text-lg text-zinc-400">
        <p>{t("contact.address")}</p>

        <p>{t("contact.phone")}</p>

        <p>{t("contact.email")}</p>
      </div>
    </div>
  );
}