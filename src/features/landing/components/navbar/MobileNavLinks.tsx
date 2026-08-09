"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { ArrowUpRight } from "lucide-react";

import { navbarLinks } from "../../data";

import { Button } from "@/components/ui/button";

import NavbarLogo from "./NavbarLogo";
import { useLocale, useTranslations } from "next-intl";

export default function MobileNavLinks() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div
      className={`
        flex h-full flex-col p-6
        ${locale === "ar" ? "items-end text-right" : "items-start text-left"}
      `}
    >
      {/* Header */}

      <div className="border-b border-white/10 px-8 py-8">
        <NavbarLogo />
      </div>

      {/* Navigation */}

      <nav
        className={`
            flex-1
            px-8
            py-12
            ${locale === "ar" ? "text-right" : "text-left"}
          `}
      >
        <ul
          className={`
    space-y-7
    ${locale === "ar" ? "text-right" : "text-left"}
  `}
        >
          {navbarLinks.map((item, index) => (
            <li
              key={item.key}
              className="animate-in fade-in slide-in-from-right-8"
              style={{
                animationDelay: `${index * 120}ms`,
                animationFillMode: "both",
              }}
            >
              <Link
                href={item.href}
                className={`
                group
                flex
                items-center
                justify-between
                gap-6
                text-3xl
                font-semibold
                tracking-wide
                transition-all
                duration-300
                ${pathname === item.href ? "text-primary" : "text-white"}
                ${
                  locale === "ar"
                    ? "flex-row-reverse hover:-translate-x-3"
                    : "flex-row hover:translate-x-3"
                }

                hover:text-primary
              `}
              >
                {t(item.key)}

                <ArrowUpRight
                  className={`
                  shrink-0
                  opacity-0
                  transition-all
                  duration-300

                  ${
                    locale === "ar"
                      ? "group-hover:-translate-x-1 group-hover:-translate-y-1"
                      : "group-hover:translate-x-1 group-hover:-translate-y-1"
                  }

                  group-hover:opacity-100
                `}
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}

      <div className=" w-full space-y-6 border-t border-white/10 p-8">
        <Button
          className="
            h-14
            w-full
            rounded-full
            text-base
            font-semibold
          "
        >
          {t("bookNow")}
        </Button>

        <div className="flex items-center justify-center gap-8 text-sm text-white/50">
          <span>Instagram</span>

          <span>Facebook</span>

          <span>X</span>
        </div>
      </div>
    </div>
  );
}
