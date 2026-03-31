import { NavLink } from "react-router-dom";
import { LayoutDashboard, Printer, Settings, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function StaffSidebar() {
  const { logout } = useAuth();
  const { isDark } = useTheme();

  const navItems = [
    {
      label: "Dashboard",
      to: "/staff",
      icon: LayoutDashboard,
    },
    {
      label: "Print Jobs",
      to: "/staff/jobs",
      icon: Printer,
    },
    {
      label: "Settings",
      to: "/staff/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className={clsx(
      "w-64 h-screen border-r transition-colors",
      isDark
        ? "bg-slate-900 border-slate-800"
        : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className={clsx(
        "p-6 border-b",
        isDark
          ? "border-slate-800"
          : "border-slate-200"
      )}>
        <div className="flex items-center gap-3">
          <div className={clsx("p-2.5 rounded-xl", isDark ? "bg-indigo-500/20" : "bg-indigo-100")}>
            <ShieldCheck size={20} className={isDark ? "text-indigo-300" : "text-indigo-600"} />
          </div>
          <div>
            <h1 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Staff Panel</h1>
            <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>QueueLess Print</p>
          </div>
        </div>
        <div className={clsx("mt-4 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700")}>
          <Sparkles size={12} />
          Live updates enabled
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/staff"}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={clsx("transition-transform", isActive ? "scale-105" : "group-hover:scale-105")} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={clsx(
        "p-4 border-t",
        isDark
          ? "border-slate-800"
          : "border-slate-200"
      )}>
        <button
          onClick={logout}
          className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
            isDark
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
