import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import StudentSidebar from "./StudentSidebar";

export function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl border-r border-slate-800 z-30 overflow-y-auto">
        <StudentSidebar />
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <h1 className="text-white font-semibold">Student Panel</h1>
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="text-white p-2 rounded-lg hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 z-50 h-screen w-64 overflow-y-auto">
            <StudentSidebar />
          </div>
        </>
      )}

      {/* Main Content with Offset */}
      <main className="w-full overflow-y-auto min-h-screen lg:ml-64 pt-16 lg:pt-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
