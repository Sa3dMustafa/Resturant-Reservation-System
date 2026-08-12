"use client";

import AboutImage from "./AboutImage";
import AboutContent from "./AboutContent";
import WhyChooseUS from "./WhyChooseUS";
// import AboutStats from "./AboutStats";

export default function AboutSection() {
  return (
    <section className="bg-black py-20 px-10" id="about">
      <div className="container">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <AboutImage />
          <AboutContent />
        </div>
      </div>
      <WhyChooseUS />
    </section>
  );
}
