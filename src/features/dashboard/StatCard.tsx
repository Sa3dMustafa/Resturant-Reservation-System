"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}

export function StatCard({ label, value, icon: Icon, active, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 text-start transition-colors",
        onClick && "cursor-pointer hover:border-primary/50",
        active && "border-primary bg-primary text-primary-foreground"
      )}
    >
      <div className="flex w-full items-start justify-between">
        <span className={cn("text-3xl font-bold", active ? "text-primary-foreground" : "text-foreground")}>
          {value}
        </span>
        <Icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "text-primary")} />
      </div>
      <span className={cn("text-sm", active ? "text-primary-foreground/90" : "text-muted-foreground")}>
        {label}
      </span>
    </button>
  );
}
