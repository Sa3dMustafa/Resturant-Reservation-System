"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter, usePathname } from "@/i18n/navigation";
import { canAccessSegment } from "@/lib/auth/rbac";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side authentication + RBAC guard for the (dashboard) route group.
 * Enforced here (not just in the sidebar) so a STAFF user typing an
 * admin-only URL directly is redirected regardless of how they navigated.
 * Because the access token lives in memory (per the auth spec — only the
 * refresh token is a cookie) role-aware protection cannot be resolved in
 * Next.js middleware before a render, so it is centralized in this single
 * guard that wraps every dashboard route instead of being duplicated
 * per-page.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const segment = pathname.split("/").filter(Boolean)[1] ?? "dashboard";

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user && !canAccessSegment(user.role, segment)) {
      router.replace("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, user, segment]);

  if (isLoading || !isAuthenticated || (user && !canAccessSegment(user.role, segment))) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-3 px-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
