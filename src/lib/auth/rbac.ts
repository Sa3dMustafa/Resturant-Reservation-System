import type { UserRole } from "@/types";

/**
 * Centralized route access control. Both the sidebar nav and the
 * (dashboard) layout guard read from this single source so UI-hiding and
 * route-protection can never drift out of sync.
 */
export const ADMIN_ONLY_SEGMENTS = [
  "tables",
  "users",
  "working-hours",
  "slot-duration",
] as const;

export function canAccessSegment(role: UserRole, segment: string): boolean {
  if (role === "ADMIN") return true;
  return !ADMIN_ONLY_SEGMENTS.includes(segment as (typeof ADMIN_ONLY_SEGMENTS)[number]);
}

export function isAdminOnlySegment(segment: string): boolean {
  return ADMIN_ONLY_SEGMENTS.includes(segment as (typeof ADMIN_ONLY_SEGMENTS)[number]);
}
