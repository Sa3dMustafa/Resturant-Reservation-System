"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function FooterBottom() {
  const t = useTranslations("Footer");

  return (
    <div className="mt-16 border-t border-primary/10 p-6">
      <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
        <p className="text-center md:text-start">{t("copyright")}</p>

        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full"
          >
            {t("privacy")}
          </Link>

          <span className="h-1 w-1 rounded-full bg-primary/40" />

          <Link
            href="/terms"
            className="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full"
          >
            {t("terms")}
          </Link>
        </div>
      </div>
    </div>
  );
}
