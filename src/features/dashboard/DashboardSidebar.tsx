"use client";

import { LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth/AuthProvider";
import { Link, usePathname } from "@/i18n/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import { profileNavItem, visibleNavItems } from "./nav-items";
import NavbarLogo from "../landing/components/navbar/NavbarLogo";
import LanguageSwitcher from "../landing/components/navbar/LanguageSwitcher";

interface DashboardSidebarProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function DashboardSidebar({ onNavigate, mobile = false }: DashboardSidebarProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const locale = useLocale();

  if (!user) return null;

  const items = visibleNavItems(user.role);

  const isActive = (href: string) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const handleLogout = async () => {
    onNavigate?.();
    await logout();
  };

  return (
    <div className={cn("flex h-full flex-col bg-background", mobile ? "w-full" : "w-full")}>
      <div className="flex h-16 items-center justify-center border-b m-5">
        <NavbarLogo />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground", isActive(item.href) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-3">
        <Separator className="mb-3" />

        <div className="mb-2 flex items-center justify-between rounded-lg px-3 py-2">
          <span className="text-sm font-medium text-muted-foreground">{tCommon("language")}</span>
          <LanguageSwitcher />
        </div>

        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/90 transition-colors hover:bg-destructive/10">
          <LogOut className="h-4 w-4 shrink-0" />
          <span>{tCommon("logout")}</span>
        </button>
      </div>

      <Link href={profileNavItem.href} onClick={onNavigate} className={cn("m-3 mt-0 flex items-center gap-3 rounded-lg border border-sidebar-border px-3 py-2.5 transition-colors hover:bg-secondary", isActive(profileNavItem.href) && "border-primary/50 bg-secondary")}>
        <Avatar className="shrink-0">
          <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.role === "ADMIN" ? t("admin") : t("staff")}</p>
        </div>
      </Link>
    </div>
  );
}