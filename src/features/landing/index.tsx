import AboutSection from "./components/about/AboutSection";
import { FeaturedDishes } from "./components/dishes";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturedDishes />
      <AboutSection />
      <Footer />
    </>
  );
}
