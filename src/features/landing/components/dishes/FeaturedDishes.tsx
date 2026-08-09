"use client";

import { useTranslations } from "next-intl";

import FeaturedDish from "./FeaturedDish";

import { featuredDishes } from "../../data/dishes";

export default function FeaturedDishes() {
  const t = useTranslations("FeaturedDishes");

  return (
    <section className="overflow-hidden bg-[#11100f]" id="popular">
      <div>
        {featuredDishes.map((dish, index) => (
          <FeaturedDish
            key={dish.id}
            image={dish.image}
            title={t(`${dish.key}.title`)}
            description={t(`${dish.key}.description`)}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
