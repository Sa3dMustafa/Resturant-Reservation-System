"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { footerLinks } from "../../data/footerdata";

export default function FooterLinks() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <div>
      <h3 className="mb-8 text-xl font-semibold text-primary">
        {t("quickLinks.title")}
      </h3>

      <ul className="space-y-5">
        {footerLinks.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className={` inline-block text-lg text-zinc-400 transition-all duration-300 hover:text-primary
                ${
                  locale === "ar"
                    ? "hover:-translate-x-1"
                    : "hover:translate-x-1"
                }
              `}
            >
              {t(`quickLinks.${item.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
