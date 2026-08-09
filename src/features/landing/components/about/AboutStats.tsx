"use client";

import { useTranslations } from "next-intl";

export default function AboutStats() {
  const t = useTranslations("AboutSection");

  const stats = [
    {
      value: t("stats.years.value"),
      label: t("stats.years.label"),
    },
    {
      value: t("stats.dishes.value"),
      label: t("stats.dishes.label"),
    },
    {
      value: t("stats.guests.value"),
      label: t("stats.guests.label"),
    },
  ];

  return (
    <div
      className="flex gap-10 border-t border-primary/30 pt-8
      "
    >
      {stats.map((item) => (
        <div key={item.label}>
          <h3 className="font-serif text-2xl text-primary">
            {item.value}
          </h3>
          <p className="uppercase text-sm text-zinc-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}