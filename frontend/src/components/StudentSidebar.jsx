import { NavLink } from "react-router-dom";
import { LayoutDashboard, Upload, FileText, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function StudentSidebar() {
  const { logout } = useAuth();
  const { isDark } = useTheme();

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
          onClick={logout}
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
    </aside>
  );
}
