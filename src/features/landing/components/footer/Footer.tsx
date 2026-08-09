"use client";

import FooterBottom from "./FooterButtom";
import FooterBrand from "./FooterBrand";
import FooterContact from "./FooterContact";
import FooterHours from "./Footerhours";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#11100f] pt-20 md:pt-24"
    >
      {/* Top Border */}
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto grid grid-cols-1 gap-12 px-6 sm:px-8 md:grid-cols-2 md:gap-14 lg:px-10 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <FooterBrand />
          <FooterLinks />
          <FooterContact />
          <FooterHours />
        </div>

        <div>
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
}
