import { KpiCards } from "@/components/admin/dashboard/kpi-cards";
import { OngoingOperations } from "@/components/admin/dashboard/ongoing-operations";
import { AlertsPanel } from "@/components/admin/dashboard/alerts-panel";
import { RecentTrips } from "@/components/admin/dashboard/recent-trips";
import { FleetStatus } from "@/components/admin/dashboard/fleet-status";
import { FinancialSnapshot } from "@/components/admin/dashboard/financial-snapshot";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6 p-6 pb-10 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Real-time overview of your fleet operations
                    </p>
                </div>
                <QuickActions />
            </div>

            {/* Section 1 — KPI Cards (5 Items in One Grid Line) */}
            <KpiCards />

            {/* Section 2 — Ongoing Operations + Alerts (Fixed Heights, Scrollbars) */}
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="h-[450px]">
                    <OngoingOperations />
                </div>
                <div className="h-[450px]">
                    <AlertsPanel />
                </div>
            </div>

            {/* Section 3 — Recent Trips + Fleet Status */}
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="h-[420px]">
                    <RecentTrips />
                </div>
                <div className="h-[420px]">
                    <FleetStatus />
                </div>
            </div>

            {/* Section 4 — Financial Snapshot & Fuel cost card */}
            <FinancialSnapshot />
        </div>
    );
}
