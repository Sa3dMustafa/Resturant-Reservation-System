"use client";

import { useTranslations } from "next-intl";

import FeatureCard from "./FeatureCard";

import { whyChooseUsData } from "../../data/about";

export default function WhyChooseUS() {
  const t = useTranslations("WhyChooseUs");

  return (
    <section className="container pt-24">
      <div className=" grid gap-12 md:grid-cols-2 lg:grid-cols-3 ">
        {whyChooseUsData.map((item, index) => (
          <div key={item.id} className=" relative flex justify-center">
            <FeatureCard
              title={t(`items.${item.key}.title`)}
              description={t(`items.${item.key}.description`)}
            />
            {index !== whyChooseUsData.length - 1 && (
              <span className=" absolute right-0 top-1/2 hidden h-72 w-px -translate-y-1/2 bg-linear-to-b from-primary via-primary/40 to-transparent lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
