import { Trash2, Eye, Download, FileText, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { motion } from "framer-motion";

export function JobCard({ job, onDelete, onView, showUser = false, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not scheduled";
    return timeString;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2.5 bg-indigo-50 rounded-lg flex-shrink-0">
            <FileText className="text-indigo-600" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate text-sm">
              {job.fileName || "Untitled"}
            </h3>
            {showUser && (
              <p className="text-xs text-slate-500 mt-1">
                by {job.userId?.name || "Unknown User"}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <Clock size={14} />
              {formatDate(job.createdAt)} at {formatTime(job.slotTime)}
            </p>
          </div>
        </div>
        <StatusBadge status={job.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Copies</p>
          <p className="text-sm font-semibold text-slate-900">{job.copies || 1}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Size</p>
          <p className="text-sm font-semibold text-slate-900">{job.pageSize || "A4"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Color</p>
          <p className="text-sm font-semibold text-slate-900">
            {job.color ? "Yes" : "B/W"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Priority</p>
          <p className={`text-sm font-semibold ${job.priority === "high" ? "text-red-600" : job.priority === "low" ? "text-blue-600" : "text-slate-900"}`}>
            {job.priority ? job.priority[0].toUpperCase() + job.priority.slice(1) : "Normal"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onView && (
          <button
            onClick={() => onView(job._id)}
            className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <Eye size={16} />
            View
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(job._id)}
            className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
