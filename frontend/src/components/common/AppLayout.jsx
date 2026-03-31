import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Settings, Moon, Sun, Home, Users, FileText, BarChart3 } from "lucide-react";
import { Button } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import clsx from "clsx";

export function AppLayout({ children, currentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isStaff = user?.role === "staff";

  const menuItems = isAdmin
    ? [
        { label: "Dashboard", icon: Home, href: "/admin" },
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Print Jobs", icon: FileText, href: "/admin/print-jobs" },
        { label: "Reports", icon: BarChart3, href: "/admin/reports" },
      ]
    : isStaff
    ? [
        { label: "Dashboard", icon: Home, href: "/staff" },
        { label: "Print Queue", icon: FileText, href: "/staff" },
      ]
    : [
        { label: "Dashboard", icon: Home, href: "/dashboard" },
        { label: "Submit Job", icon: FileText, href: "/submit-job" },
        { label: "Your Requests", icon: BarChart3, href: "/my-jobs" },
      ];

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/auth");
  };

  return (
    <div className={clsx("min-h-screen", isDark ? "bg-slate-900" : "bg-slate-50")}>
      {/* Top Navbar */}
      <nav
        className={clsx(
          "border-b sticky top-0 z-40",
          isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
        )}
      >
        <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Menu & Logo */}
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              )}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            <div className="font-bold text-xl text-blue-600">QueueLess</div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
              )}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* User Info */}
            <div
              className={clsx(
                "px-3 py-2 rounded-lg hidden sm:block",
                isDark ? "bg-slate-700" : "bg-slate-100"
              )}
            >
              <p className={clsx("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>
                {user?.name}
              </p>
              <p className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>
                {user?.role === "superadmin"
                  ? "Super Admin"
                  : user?.role === "admin"
                  ? "Administrator"
                  : user?.role === "staff"
                  ? "Staff"
                  : "Student"}
              </p>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutConfirm(true)}
              icon={LogOut}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                "w-64 border-r min-h-screen p-6 hidden sm:block",
                isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
              )}
            >
              <nav className="space-y-2">
                {menuItems.map(({ label, icon: Icon, href }) => (
                  <motion.button
                    key={href}
                    onClick={() => navigate(href)}
                    whileHover={{ x: 4 }}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                      currentPage === label
                        ? "bg-blue-600 text-white"
                        : isDark
                        ? "text-slate-300 hover:bg-slate-700"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Icon size={20} />
                    {label}
                  </motion.button>
                ))}
              </nav>

              {/* Settings */}
              <motion.button
                whileHover={{ x: 4 }}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-8 text-left",
                  isDark
                    ? "text-slate-300 hover:bg-slate-700"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                onClick={() => navigate("/settings")}
              >
                <Settings size={20} />
                Settings
              </motion.button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
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
              <h3 className={clsx("text-lg font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                Confirm Logout
              </h3>
              <p className={clsx("mb-6", isDark ? "text-slate-400" : "text-slate-600")}>
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
