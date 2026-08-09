"use client";

import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import { footerLogo, socialLinks } from "../../data/footerdata";
import NavbarLogo from "../navbar/NavbarLogo";

export default function FooterBrand() {
  const t = useTranslations("Footer");

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={footerLogo}
          alt="Savora"
          width={100}
          height={35}
          priority
          className="h-auto w-25"
        />
        <NavbarLogo />
      </div>
      <p className="mt-8 max-w-sm text-lg leading-9 text-zinc-400">
        {t("description")}
      </p>

      <div className="mt-8 flex items-center justify-center gap-5">
        {socialLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/3 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary
              "
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
