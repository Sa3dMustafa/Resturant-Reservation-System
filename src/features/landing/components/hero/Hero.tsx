"use client";

import { heroSlides } from "../../data";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroDots from "./HeroDots";
import HeroOverlay from "./HeroOverlay";

import { useHeroSlider } from "../../hooks/useHeroSlider";

export default function Hero() {
  const {
    currentSlide,
    setCurrentSlide,
  } = useHeroSlider(heroSlides.length);

  return (
    <section className="relative h-screen overflow-hidden" id="home">

      <HeroBackground
        slides={heroSlides}
        currentSlide={currentSlide}
      />

      <HeroOverlay />

      <HeroContent
        slide={heroSlides[currentSlide]}
      />

      <HeroDots
        total={heroSlides.length}
        currentSlide={currentSlide}
        onChange={setCurrentSlide}
      />

    </section>
  );
}