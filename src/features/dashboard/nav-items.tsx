import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  LayoutGrid,
  LayoutList,
  Timer,
  Users,
  UserRound,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  segment: string;
  adminOnly?: boolean;
}

export const dashboardNavItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutGrid, segment: "dashboard" },
  {
    href: "/dashboard/reservations",
    labelKey: "reservations",
    icon: CalendarClock,
    segment: "reservations",
  },
  { href: "/dashboard/users", labelKey: "staffAccounts", icon: Users, segment: "users", adminOnly: true },
  { href: "/dashboard/tables", labelKey: "manageTables", icon: LayoutList, segment: "tables", adminOnly: true },
  {
    href: "/dashboard/working-hours",
    labelKey: "workingHours",
    icon: Timer,
    segment: "working-hours",
    adminOnly: true,
  },
  {
    href: "/dashboard/slot-duration",
    labelKey: "slotDuration",
    icon: Timer,
    segment: "slot-duration",
    adminOnly: true,
  },
];

export const profileNavItem: NavItem = {
  href: "/dashboard/profile",
  labelKey: "profile",
  icon: UserRound,
  segment: "profile",
};

export function visibleNavItems(role: UserRole) {
  return dashboardNavItems.filter((item) => role === "ADMIN" || !item.adminOnly);
}
