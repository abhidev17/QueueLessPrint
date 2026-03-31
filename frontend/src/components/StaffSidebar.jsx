import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Printer, Settings, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function StaffSidebar() {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

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
      "w-72 h-screen border-r transition-colors",
      isDark
        ? "bg-slate-900 border-slate-800"
        : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className={clsx(
        "p-7 border-b",
        isDark
          ? "border-slate-800"
          : "border-slate-200"
      )}>
        <div className="flex items-center gap-3.5">
          <div className={clsx("p-3.5 rounded-xl", isDark ? "bg-indigo-500/20" : "bg-indigo-100")}>
            <ShieldCheck size={26} className={isDark ? "text-indigo-300" : "text-indigo-600"} />
          </div>
          <div>
            <h1 className={clsx("text-[22px] font-bold", isDark ? "text-white" : "text-slate-900")}>Staff Panel</h1>
            <p className={clsx("text-[13px]", isDark ? "text-slate-400" : "text-slate-500")}>QueueLess Print</p>
          </div>
        </div>
        <div className={clsx("mt-4 inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full", isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700")}>
          <Sparkles size={12} />
          Live updates enabled
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-7 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/staff"}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-4 px-4.5 py-4 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40"
                    : isDark
                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} className={clsx("transition-transform", isActive ? "scale-105" : "group-hover:scale-105")} />
                  <span className="font-semibold text-[17px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={clsx(
        "p-5 border-t",
        isDark
          ? "border-slate-800"
          : "border-slate-200"
      )}>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={clsx(
            "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all",
            isDark
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          <LogOut size={22} />
          <span className="text-[17px]">Logout</span>
        </button>
      </div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={clsx(
                "rounded-xl p-6 max-w-sm mx-4",
                isDark ? "bg-slate-800" : "bg-white"
              )}
            >
              <h3 className={clsx("text-lg font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>Confirm Logout</h3>
              <p className={clsx("mb-6", isDark ? "text-slate-400" : "text-slate-600")}>Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  className={clsx(
                    "flex-1 px-4 py-2 rounded-lg font-medium",
                    isDark ? "bg-slate-700 text-slate-100 hover:bg-slate-600" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  )}
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
