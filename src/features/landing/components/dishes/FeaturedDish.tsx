"use client";

import { cn } from "@/lib/utils/cn";

import DishContent from "./DishContent";
import DishImage from "./DishImage";

import { Dishes } from "../../types";

export default function FeaturedDish({
  image,
  title,
  description,
  reverse = false,
}: Dishes) {
  return (
    <section className="overflow-hidden">
      <div
        className={cn(
          `
          mx-auto
          grid
          min-h-162.5
          items-center

          lg:grid-cols-2
          `,
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <DishImage
          image={image}
          title={title}
          reverse={reverse}
        />

        <DishContent
          title={title}
          description={description}
          reverse={reverse}
        />
      </div>
    </section>
  );
}