import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Bell, Lock, User, Palette } from "lucide-react";
import clsx from "clsx";

export default function StaffSettings() {
  const { user } = useAuth();
  const { isDark, setIsDark } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Manage your preferences and account settings
        </p>
      </div>

      {/* Account Section */}
      <div className={clsx(
        "rounded-lg border p-6 space-y-4",
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
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
            isDark ? "text-gray-300" : "text-gray-700"
          )}>
            Name
          </label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border",
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-300"
              : "bg-gray-50 border-gray-300 text-gray-700"
          )}>
            {user?.name}
          </div>
        </div>

        <div>
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-gray-300" : "text-gray-700"
          )}>
            Email
          </label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border",
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-300"
              : "bg-gray-50 border-gray-300 text-gray-700"
          )}>
            {user?.email}
          </div>
        </div>

        <div>
          <label className={clsx(
            "text-sm font-medium",
            isDark ? "text-gray-300" : "text-gray-700"
          )}>
            Role
          </label>
          <div className={clsx(
            "mt-2 px-4 py-2 rounded-lg border capitalize",
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-300"
              : "bg-gray-50 border-gray-300 text-gray-700"
          )}>
            {user?.role}
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className={clsx(
        "rounded-lg border p-6 space-y-4",
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
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
            isDark ? "text-gray-300" : "text-gray-700"
          )}>
            Dark Mode
          </label>
          <button
            onClick={() => setIsDark(!isDark)}
            className={clsx(
              "w-12 h-6 rounded-full transition-colors flex items-center padding-1",
              isDark ? "bg-blue-600" : "bg-gray-300"
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
        "rounded-lg border p-6 space-y-4",
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
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
            isDark ? "text-gray-300" : "text-gray-700"
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
            isDark ? "text-gray-300" : "text-gray-700"
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
        "rounded-lg border p-6 space-y-4",
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
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
