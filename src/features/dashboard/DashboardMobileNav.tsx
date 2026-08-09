"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="md:hidden shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="start" className="w-72 p-0 sm:max-w-72">
        <SheetTitle className="sr-only">{t("dashboardNavigation")}</SheetTitle>
        <DashboardSidebar mobile onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}