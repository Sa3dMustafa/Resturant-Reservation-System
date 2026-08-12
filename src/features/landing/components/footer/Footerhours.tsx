"use client";

import { useTranslations } from "next-intl";

export default function FooterHours() {
  const t = useTranslations("Footer");

  return (
    <div>
      <h3 className="mb-8 text-xl font-semibold text-primary">
        {t("hours.title")}
      </h3>

      <div className="space-y-7">
        <div>
          <p className="text-lg font-medium text-zinc-300">
            {t("hours.weekdays")}
          </p>

          <span className="text-zinc-500">
            {t("hours.weekdaysTime")}
          </span>
        </div>

        <div>
          <p className="text-lg font-medium text-zinc-300">
            {t("hours.weekend")}
          </p>

          <span className="text-zinc-500">
            {t("hours.weekendTime")}
          </span>
        </div>
      </div>
    </div>
  );
}