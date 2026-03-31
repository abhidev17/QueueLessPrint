import { CheckCircle2, Clock, AlertCircle, Trash2, Zap } from "lucide-react";

export function StatusBadge({ status, size = "md" }) {
  const normalize = (s) => s?.toLowerCase() || "";
  const normalizedStatus = normalize(status);

  const configs = {
    completed: {
      colors: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: CheckCircle2,
      label: "Completed"
    },
    printing: {
      colors: "bg-blue-100 text-blue-800 border-blue-300",
      icon: Zap,
      label: "Printing"
    },
    pending: {
      colors: "bg-amber-100 text-amber-800 border-amber-300",
      icon: Clock,
      label: "Pending"
    },
    failed: {
      colors: "bg-red-100 text-red-800 border-red-300",
      icon: AlertCircle,
      label: "Failed"
    },
    deleted: {
      colors: "bg-gray-100 text-gray-800 border-gray-300",
      icon: Trash2,
      label: "Deleted"
    }
  };

  const config = configs[normalizedStatus] || configs.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  };

  return (
    <span className={`inline-flex items-center font-medium border rounded-full whitespace-nowrap transition-colors ${config.colors} ${sizeClasses[size]}`}>
      <Icon size={size === "sm" ? 14 : size === "md" ? 16 : 18} className="flex-shrink-0" />
      {config.label}
    </span>
  );
}
