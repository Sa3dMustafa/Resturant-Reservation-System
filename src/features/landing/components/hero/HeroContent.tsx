"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { HeroSlide } from "../../types";

import { Button } from "@/components/ui/button";
import BookingButton from "../BookingButton";

interface Props {
  slide: HeroSlide;
}

export default function HeroContent({ slide }: Props) {
  const t = useTranslations("Hero");

  return (
    <div className="relative z-20 flex h-full items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold text-white lg:text-7xl">
          {t(`${slide.key}.title`)}
        </h1>

        <p className="mt-6 max-w-xl text-2xl leading-8 text-neutral-200">
          {t(`${slide.key}.description`)}
        </p>

        <BookingButton className="mt-10 px-16 h-14 text-base" />
      </div>
    </div>
  );
}
