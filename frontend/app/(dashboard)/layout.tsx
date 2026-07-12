import Sidebar from "@/app/components/admin/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              Fleet Management
            </span>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
