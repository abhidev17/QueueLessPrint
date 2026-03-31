import { Trash2, Eye, Edit2, MoreVertical } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { motion } from "framer-motion";

export function JobTable({
  jobs,
  onDelete,
  onUpdate,
  onView,
  showUser = false,
  isLoading = false,
  actions = ["view", "edit", "delete"]
}) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">File</th>
            {showUser && <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Student</th>}
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Details</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <motion.tr
              key={job._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-indigo-600">
                      {job.fileName ? job.fileName[0].toUpperCase() : "F"}
                    </span>
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-slate-900 truncate">
                      {job.fileName || "Untitled"}
                    </p>
                    <p className="text-xs text-slate-500">{job.copies} copy • {job.pageSize}</p>
                  </div>
                </div>
              </td>
              {showUser && (
                <td className="px-6 py-4 text-sm text-slate-900">
                  {job.userId?.name || "Unknown"}
                </td>
              )}
              <td className="px-6 py-4 text-sm text-slate-600">
                {formatDate(job.createdAt)}
              </td>
              <td className="px-6 py-4 text-xs">
                <div className="flex gap-2">
                  {job.color && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Color</span>
                  )}
                  {job.priority === "high" && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">High</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={job.status} size="sm" />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {actions.includes("view") && onView && (
                    <button
                      onClick={() => onView(job._id)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {actions.includes("edit") && onUpdate && (
                    <button
                      onClick={() => onUpdate(job._id)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  {actions.includes("delete") && onDelete && (
                    <button
                      onClick={() => onDelete(job._id)}
                      className="p-1.5 hover:bg-red-50 rounded text-slate-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
