import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Bell, Lock, User, Palette } from "lucide-react";
import clsx from "clsx";

export default function StaffSettings() {
  const { user } = useAuth();
  const { isDark, setIsDark } = useTheme();

  // Safe render guard
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Settings</h1>
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          Manage your preferences and account settings
        </p>
      </div>

      {/* Account Section */}
      <div className={clsx(
        "rounded-xl border p-5 space-y-4",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{
          borderColor: isDark ? "#374151" : "#e5e7eb"
        }}>
          <User size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Account</h2>
        </div>

        <div>
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>
            Name
          </label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border",
            isDark
              ? "bg-slate-700 border-slate-600 text-slate-300"
              : "bg-slate-50 border-slate-300 text-slate-700"
          )}>
            {user?.name}
          </div>
        </div>

        <div>
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>
            Email
          </label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border",
            isDark
              ? "bg-slate-700 border-slate-600 text-slate-300"
              : "bg-slate-50 border-slate-300 text-slate-700"
          )}>
            {user?.email}
          </div>
        </div>

        <div>
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>
            Role
          </label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border capitalize",
            isDark
                    ? "bg-slate-700 border-slate-600 text-slate-300"
                    : "bg-slate-50 border-slate-300 text-slate-700"
          )}>
            {user?.role}
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className={clsx(
        "rounded-xl border p-5 space-y-4",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{
          borderColor: isDark ? "#374151" : "#e5e7eb"
        }}>
          <Palette size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>
            Dark Mode
          </label>
          <button
            onClick={() => setIsDark(!isDark)}
            className={clsx(
              "w-12 h-6 rounded-full transition-colors flex items-center padding-1",
              isDark ? "bg-blue-600" : "bg-slate-300"
            )}
          >
            <div className={clsx(
              "w-5 h-5 bg-white rounded-full transition-transform",
              isDark ? "translate-x-6" : "translate-x-0.5"
            )} />
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className={clsx(
        "rounded-xl border p-5 space-y-4",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{
          borderColor: isDark ? "#374151" : "#e5e7eb"
        }}>
          <Bell size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="flex items-center justify-between">
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>
            Email Notifications
          </label>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-slate-300" : "text-slate-700"
          )}>
            Job Status Updates
          </label>
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* Security Section */}
      <div className={clsx(
        "rounded-xl border p-5 space-y-4",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3 pb-4 border-b" style={{
          borderColor: isDark ? "#374151" : "#e5e7eb"
        }}>
          <Lock size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>

        <button className={clsx(
          "w-full px-4 py-2 rounded-lg font-medium transition-colors",
          isDark
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-red-100 hover:bg-red-200 text-red-700"
        )}>
          Change Password
        </button>
      </div>
    </div>
  );
}
