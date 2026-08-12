import { DashboardSidebar } from "@/features/dashboard/DashboardSidebar";
import { RouteGuard } from "@/features/auth/RouteGuard";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <aside className="hidden w-72 shrink-0 border-e border-sidebar-border md:block">
          <DashboardSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </RouteGuard>
  );
}
