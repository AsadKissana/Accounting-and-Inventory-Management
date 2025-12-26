import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { StatsGrid } from "@/components/Dashboard/stats-grid";
import { InventoryOverview } from "@/components/Dashboard/inventory-overview";
import { RecentTransactions } from "@/components/Dashboard/recent-transactions";

export function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center justify-between">
              <DashboardHeader
                title="Accounting Overview"
                description="Monitor your financial health and inventory levels in real-time."
              />
              <SidebarTrigger className="md:hidden" />
            </div>
            <StatsGrid />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <InventoryOverview />
              </div>
              <RecentTransactions />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
