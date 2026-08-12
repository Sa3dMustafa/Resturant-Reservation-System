"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface BookingButtonProps {
  className?: string;
}

export default function BookingButton({ className }: BookingButtonProps) {
  const t = useTranslations("Hero");

  return (
    <Button
      asChild
      size="lg"
      className={cn(
        `rounded-xl bg-linear-to-r from-[#A9802F]via-[#C69E45] to-[#DDB557] text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[#DDB557]/30
        `,
        className,
      )}
    >
      <Link href="/reservation">{t("button")}</Link>
    </Button>
  );
}
