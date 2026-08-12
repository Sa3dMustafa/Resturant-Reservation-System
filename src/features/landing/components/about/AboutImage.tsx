"use client"
import Image from "next/image";

import { aboutData } from "../../data/about";
import { useTranslations } from "next-intl";

export default function AboutImage() {
      const t = useTranslations("AboutSection");
    
  return (
    <div className="relative flex flex-col">
      <div className="relative h-162 overflow-hidden">
        <Image
          src={aboutData.image}
          alt="Restaurant Kitchen"
          fill
          sizes="(max-width:1024px) 100vw, 45vw"
          className="object-cover"
        />
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          bg-linear-to-t
          from-black
          to-transparent
          px-8
          py-8
        "
      ></div>
      <div className="p-6 border-t border-primary">
        <p className="font-serif text-2xl text-white">
          {t("image.title")}
        </p>

        <span className="mt-3 block text-sm uppercase tracking-[0.3em] text-primary">
          {t("image.subtitle")}
        </span>
      </div>
    </div>
  );
}
