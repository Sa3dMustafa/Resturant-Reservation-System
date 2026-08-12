"use client";

import { cn } from "@/lib/utils/cn";

import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import MobileMenu from "./MobileMenu";
import { useScroll } from "../../hooks/useScrolled";

export default function Navbar() {
  const isScrolled = useScroll();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,.35)]"
          : "bg-transparent",
      )}
    >
      <div className="px-5 lg:px-24">
        <nav className="flex h-20 items-center justify-between">
          <NavbarLogo />

          <NavbarLinks />

          <NavbarActions />

          <MobileMenu />
        </nav>
      </div>

      <div
        className={cn(
          "h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300",
          isScrolled ? "opacity-100" : "opacity-0",
        )}
      />
    </header>
  );
}
