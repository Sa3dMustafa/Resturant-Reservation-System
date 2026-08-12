import { PackageOpen, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon = PackageOpen, className, action }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">{title}</p>
        {description ? <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
