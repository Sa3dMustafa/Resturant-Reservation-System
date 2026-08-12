"use client";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import MobileNavLinks from "./MobileNavLinks";
import LanguageSwitcher from "./LanguageSwitcher"

export default function MobileMenu() {
  return (
    <div className="flex gap-4 lg:hidden">
      <LanguageSwitcher />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="
              rounded-full
              text-white
              transition-all
              duration-300
              hover:bg-white/10
            "
          >
            <Menu className="size-7" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="end"
          className="
            w-full
            border-none
            bg-neutral-950/95
            p-0
            text-white
            backdrop-blur-3xl
          "
        >
          <MobileNavLinks />
        </SheetContent>
      </Sheet>
    </div>
  );
}
