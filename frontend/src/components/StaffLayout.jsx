import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";

export function StaffLayout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl border-r border-slate-800 z-1000 overflow-y-auto">
        <StaffSidebar />
      </div>

      {/* Main Content with Offset */}
      <main className="ml-72 w-full overflow-y-auto h-screen">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
