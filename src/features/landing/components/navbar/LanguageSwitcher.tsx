"use client";

import { Globe } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "../../../../i18n/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const locale = useLocale();

  const t = useTranslations("Navbar");

  const router = useRouter();

  const pathname = usePathname();

  function changeLanguage(nextLocale: "en" | "ar") {
    router.replace(pathname, {
      locale: nextLocale,
      scroll: false,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
          gap-2
          rounded-full
          text-white
          transition-all
          duration-300
          hover:bg-white/10
          hover:text-primary
        "
        >
          <Globe className="size-4" />

          {locale === "en" ? t("english") : t("arabic")}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
    w-44
    rounded-xl
    border
    border-white/10
    bg-neutral-900/95
    p-2
    text-white
    shadow-2xl
    backdrop-blur-xl
  "
      >
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className="dropdownMenuItem"
        >
          🇬🇧 {t("english")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeLanguage("ar")}
          className="dropdownMenuItem"
        >
          🇪🇬 {t("arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
