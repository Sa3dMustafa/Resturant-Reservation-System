"use client";

import { useTranslations } from "next-intl";
import AboutStats from "./AboutStats";

export default function AboutContent() {
  const t = useTranslations("AboutSection");

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="h-px w-12 bg-primary" />

        <span className="text-2xl font-bold text-primary">{t("badge")}</span>
      </div>

      <div className="my-6">
        <h2 className="font-serif text-5xl leading-tight text-white">
          {t("title.first")}
        </h2>

        <h3 className="mt-3 font-serif text-4xl leading-tight text-primary">
          {t("title.second")}
        </h3>

        <p className="mt-6 text-lg leading-9 text-zinc-400">
          {t("description.first")}
        </p>

        <p className="mt-2 text-lg leading-9 text-zinc-400">
          {t("description.second")}
        </p>
      </div>

      <div className="m-6 border-l border-primary pl-6">
        <p className="font-garamond text-xl italic text-primary">
          {t("quote.text")}
        </p>
        <p className="m-5 uppercase text-zinc-500">{t("quote.author")}</p>
      </div>
      <AboutStats />
    </div>
  );
}
