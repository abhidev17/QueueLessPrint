import React from "react";
import { useTheme } from "../../context/ThemeContext";
import clsx from "clsx";

// Import all new component modules
export { StatusBadge } from "./StatusBadge";
export { JobCard } from "./JobCard";
export { ConfirmModal } from "./ConfirmModal";
export { LoadingSpinner, CardSkeleton } from "./LoadingSpinner";
export { EmptyState } from "./EmptyState";
export { JobTable } from "./JobTable";
export { FilterBar } from "./FilterBar";

/**
 * Professional Button Component
 * @param {string} variant - primary | secondary | danger | ghost
 * @param {string} size - sm | md | lg
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  const { isDark } = useTheme();

  const baseStyles = "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: isDark
      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: isDark
      ? "bg-slate-700 text-slate-100 hover:bg-slate-600 focus:ring-slate-500"
      : "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: isDark
      ? "text-slate-300 hover:bg-slate-800 focus:ring-slate-500"
      : "text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

/**
 * Professional Card Component
 */
export function Card({
  children,
  className,
  hoverable = false,
  ...props
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={clsx(
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200",
        "border rounded-xl p-6 transition-all",
        hoverable && "hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Professional Input Component with validation
 */
export function Input({
  label,
  error,
  required,
  type = "text",
  icon: Icon,
  className,
  ...props
}) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={clsx("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className={clsx("absolute left-3 top-3", isDark ? "text-slate-500" : "text-slate-400")} size={20} />}
        <input
          type={type}
          className={clsx(
            "w-full px-4 py-2.5 rounded-lg border-2 transition-all text-base",
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500",
            error && (isDark ? "border-red-500" : "border-red-500"),
            Icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Badge Component
 */
export function Badge({ children, variant = "default", className, ...props }) {
  const { isDark } = useTheme();

  const variants = {
    default: isDark ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-900",
    success: isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-900",
    warning: isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-900",
    error: isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-900",
    info: isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-900",
  };

  return (
    <span
      className={clsx(
        "inline-block px-3 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Loading Skeleton
 */
export function Skeleton({ className, ...props }) {
  const { isDark } = useTheme();

  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg",
        isDark ? "bg-slate-700" : "bg-slate-200",
        className
      )}
      {...props}
    />
  );
}

/**
 * Alert Component
 */
export function Alert({ children, type = "info", title, className, ...props }) {
  const { isDark } = useTheme();

  const styles = {
    info: isDark
      ? "bg-blue-900/20 border-blue-700 text-blue-200"
      : "bg-blue-50 border-blue-200 text-blue-900",
    success: isDark
      ? "bg-green-900/20 border-green-700 text-green-200"
      : "bg-green-50 border-green-200 text-green-900",
    warning: isDark
      ? "bg-yellow-900/20 border-yellow-700 text-yellow-200"
      : "bg-yellow-50 border-yellow-200 text-yellow-900",
    error: isDark
      ? "bg-red-900/20 border-red-700 text-red-200"
      : "bg-red-50 border-red-200 text-red-900",
  };

  return (
    <div
      className={clsx(
        "border rounded-lg p-4",
        styles[type],
        className
      )}
      {...props}
    >
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      {children}
    </div>
  );
}

/**
 * Modal Component
 */
export function Modal({ isOpen, onClose, title, children, footer, size = "md", ...props }) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          "relative rounded-xl p-6 w-full mx-4",
          isDark ? "bg-slate-800" : "bg-white",
          sizes[size]
        )}
        {...props}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={clsx(
            "absolute top-4 right-4 p-2 rounded-lg transition-colors",
            isDark ? "hover:bg-slate-700" : "hover:bg-slate-100"
          )}
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2 className={clsx("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="mb-6">{children}</div>

        {/* Footer */}
        {footer && <div className="flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * Progress Bar
 */
export function ProgressBar({ value, max = 100, label, size = "md", className }) {
  const { isDark } = useTheme();
  const percentage = (value / max) * 100;

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between">
          <span className={clsx("text-sm font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>
            {label}
          </span>
          <span className={clsx("text-sm font-semibold", isDark ? "text-slate-400" : "text-slate-600")}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          "rounded-full overflow-hidden",
          isDark ? "bg-slate-700" : "bg-slate-200",
          sizes[md],
          className
        )}
      >
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
