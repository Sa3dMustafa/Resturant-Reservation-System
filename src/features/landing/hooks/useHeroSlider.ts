"use client";

import { useEffect, useState } from "react";

export function useHeroSlider(length: number) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [length]);

  return {
    currentSlide,
    setCurrentSlide,
  };
}