import { useState } from "react";
import {
  Printer,
  FileText,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";

function Sidebar({ setPage, page, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isStaff = user?.role === "staff" || isAdmin;
  const isStudent = user?.role === "student";

  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(isStudent ? [{ id: "student", label: "Submit Print", icon: Printer }] : []),
    ...(isStudent ? [{ id: "jobs", label: "Your Requests", icon: FileText }] : []),
    ...(isStaff && !isAdmin ? [{ id: "staff", label: "Print Queue", icon: Printer }] : []),
    ...(isAdmin ? [{ id: "admin", label: "Admin Panel", icon: ShieldCheck }] : [])
  ];

  const sidebarContent = (
    <>
      <div className="mb-8 border-b border-white/15 pb-4">
        <h1 className="text-xl font-bold tracking-tight">QueueLess Print</h1>
        <p className="text-xs text-slate-300 mt-1">
          {user?.role === "superadmin"
            ? "Super Admin Workspace"
            : isAdmin
            ? "Admin Workspace"
            : isStaff
            ? "Staff Workspace"
            : "Student Workspace"}
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        {items.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                active
                  ? "bg-cyan-300 text-slate-900 shadow-sm"
                  : "text-slate-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-white/15 space-y-3">
        <div>
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-300 capitalize">
            {user?.role === "superadmin" ? "SUPER ADMIN" : user?.role}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-rose-500/90 hover:bg-rose-500 transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:h-screen md:sticky md:top-0 bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-white flex-col p-4 shadow-xl">
        {sidebarContent}
      </aside>

      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-900 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setOpen(false)}>
          <aside
            className="w-72 h-full bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-white flex flex-col p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
