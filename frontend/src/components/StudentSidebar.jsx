import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, Settings, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function StudentSidebar() {
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
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Submit Job",
      to: "/dashboard/submit",
      icon: Upload,
    },
    {
      label: "Your Requests",
      to: "/dashboard/jobs",
      icon: FileText,
    },
    {
      label: "Settings",
      to: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className={clsx(
      "w-64 h-screen border-r transition-colors",
      isDark
        ? "bg-gray-900 border-gray-800"
        : "bg-white border-gray-200"
    )}>
      {/* Header */}
      <div className={clsx(
        "p-6 border-b",
        isDark
          ? "border-gray-800"
          : "border-gray-200"
      )}>
        <h1 className="text-2xl font-bold text-blue-600">Student</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={clsx(
        "p-4 border-t",
        isDark
          ? "border-gray-800"
          : "border-gray-200"
      )}>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            isDark
              ? "text-gray-300 hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <LogOut size={20} />
          <span>Logout</span>
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
