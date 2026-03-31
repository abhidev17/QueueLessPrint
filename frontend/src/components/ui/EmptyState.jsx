import { FileText, Inbox, AlertCircle } from "lucide-react";

export function EmptyState({ type = "jobs", title, message, icon: Icon = null }) {
  const configs = {
    jobs: {
      icon: Inbox,
      title: "No print jobs yet",
      message: "Submit your first print job to get started!",
      color: "indigo"
    },
    users: {
      icon: AlertCircle,
      title: "No users found",
      message: "Create a new user account to get started.",
      color: "blue"
    },
    search: {
      icon: FileText,
      title: "No results found",
      message: "Try adjusting your search filters.",
      color: "slate"
    },
    error: {
      icon: AlertCircle,
      title: "Something went wrong",
      message: "Please try again later.",
      color: "red"
    }
  };

  const config = configs[type] || configs.jobs;
  const DisplayIcon = Icon || config.icon;
  const bgColor = {
    indigo: "bg-indigo-50",
    blue: "bg-blue-50",
    slate: "bg-slate-50",
    red: "bg-red-50"
  }[config.color];

  const iconColor = {
    indigo: "text-indigo-600",
    blue: "text-blue-600",
    slate: "text-slate-600",
    red: "text-red-600"
  }[config.color];

  return (
    <div className={`${bgColor} rounded-lg border border-slate-200 p-12 text-center`}>
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${bgColor} border-2 border-slate-200`}>
          <DisplayIcon className={`${iconColor} w-8 h-8`} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title || config.title}</h3>
      <p className="text-slate-600 max-w-sm mx-auto">{message || config.message}</p>
    </div>
  );
}
