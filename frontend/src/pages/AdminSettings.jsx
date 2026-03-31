import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Bell, Lock, User, Palette } from "lucide-react";
import clsx from "clsx";

export default function AdminSettings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>Settings</h1>
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          Manage your administrator preferences and account settings
        </p>
      </div>

      <div className={clsx(
        "rounded-xl border p-6 space-y-4",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
          <User size={24} className="text-blue-600" />
          <h2 className={clsx("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>Admin Account</h2>
        </div>

        <div>
          <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Name</label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border",
            isDark ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700"
          )}>
            {user?.name}
          </div>
        </div>

        <div>
          <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Email</label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border",
            isDark ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700"
          )}>
            {user?.email}
          </div>
        </div>

        <div>
          <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Role</label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border capitalize",
            isDark ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700"
          )}>
            {user?.role}
          </div>
        </div>
      </div>

      <div className={clsx(
        "rounded-xl border p-6 space-y-4",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
          <Palette size={24} className="text-blue-600" />
          <h2 className={clsx("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Dark Mode</label>
          <button
            onClick={toggleTheme}
            className={clsx("w-12 h-6 rounded-full transition-colors flex items-center", isDark ? "bg-blue-600" : "bg-slate-300")}
          >
            <div className={clsx("w-5 h-5 bg-white rounded-full transition-transform", isDark ? "translate-x-6" : "translate-x-0.5")} />
          </button>
        </div>
      </div>

      <div className={clsx(
        "rounded-xl border p-6 space-y-4",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
          <Bell size={24} className="text-blue-600" />
          <h2 className={clsx("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>Notifications</h2>
        </div>

        <div className="flex items-center justify-between">
          <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Email Notifications</label>
          <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
        </div>

        <div className="flex items-center justify-between">
          <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Critical System Alerts</label>
          <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      <div className={clsx(
        "rounded-xl border p-6 space-y-4",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
          <Lock size={24} className="text-blue-600" />
          <h2 className={clsx("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>Security</h2>
        </div>

        <button
          className={clsx(
            "w-full px-4 py-2 rounded-lg font-medium transition-colors",
            isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-100 hover:bg-red-200 text-red-700"
          )}
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
