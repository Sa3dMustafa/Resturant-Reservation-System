"use client";

import { useTranslations } from "next-intl";

import { navbarLinks } from "../../data";

export default function NavbarLinks() {
  const t = useTranslations("Navbar");

  return (
    <ul className="hidden items-center gap-10 lg:flex">
      {navbarLinks.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            className="
              group
              relative
              flex
              items-center
              py-2
              text-lg
              font-medium
              tracking-wide
              text-white/90
              transition-colors
              duration-300
              hover:text-primary
            "
          >
            {t(item.key)}

            <span
              className="
                absolute
                -bottom-1
                left-1/2
                h-0.5
                w-0
                -translate-x-1/2
                rounded-full
                bg-primary
                transition-all
                duration-300
                group-hover:w-full
              "
            />
          </a>
        </li>
      ))}
    </ul>
  );
}