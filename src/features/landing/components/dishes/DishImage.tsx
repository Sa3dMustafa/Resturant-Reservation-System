"use client";

import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import { useReveal } from "../../hooks/useReveal";

interface Props {
  image: string;
  title: string;
  reverse: boolean;
}

export default function DishImage({ image, title, reverse }: Props) {
  const { ref, show } = useReveal();

  return (
    <div
      ref={ref}
      className=" flex items-center overflow-hidden justify-center"
    >
      <div
        className={cn(
          `
          relative

          h-95
          w-95

          md:h-130
          md:w-130

          lg:h-180
          lg:w-180

          xl:h-212.5
          xl:w-212.5

          transition-all
          duration-1000
          `,
          show
            ? "translate-x-0 opacity-100"
            : reverse
              ? "translate-x-28 opacity-0"
              : "-translate-x-28 opacity-0",
        )}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
