"use client";

import { cn } from "@/lib/utils/cn";
import { useReveal } from "../../hooks/useReveal";

interface Props {
  title: string;
  description: string;
  reverse: boolean;
}

export default function DishContent({
  title,
  description,
  reverse,
}: Props) {
  const { ref, show } = useReveal();

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full items-center px-8 lg:px-16",
        reverse ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "w-full text-center transition-all duration-700",
          show
            ? "translate-x-0 opacity-100"
            : reverse
              ? "-translate-x-16 opacity-0"
              : "translate-x-16 opacity-0"
        )}
      >
        <span className="mb-3 inline-block  h-px w-16 bg-primary" />

        <h2 className="text-3xl font-semibold leading-tight text-white lg:text-5xl">
          {title}
        </h2>

        <p className="mt-6 text-base leading-8 text-zinc-400 lg:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}