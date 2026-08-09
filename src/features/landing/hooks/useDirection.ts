// hooks/useDirection.ts

"use client";

import { useLocale } from "next-intl";

export function useDirection() {
  const locale = useLocale();

  return {
    locale,
    isRTL: locale === "ar",
    direction: locale === "ar" ? "rtl" : "ltr",
  };
}
