import Image from "next/image";

import { HeroSlide } from "../../types";

interface Props {
  slides: HeroSlide[];
  currentSlide: number;
}

export default function HeroBackground({ slides, currentSlide }: Props) {
  return (
    <>
      {slides.map((slide, index) => (
        <Image
          key={slide.id}
          src={slide.image}
          alt={`Hero ${slide.id}`}
          fill
          sizes="100vw"
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </>
  );
}
