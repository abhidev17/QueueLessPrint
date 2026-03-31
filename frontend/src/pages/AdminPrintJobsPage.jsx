import { useState, useEffect } from "react";
import { Printer, RefreshCw, Play, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function AdminPrintJobsPage({ user }) {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const normalize = (s) => s?.toLowerCase() || "";

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/print/all");
      setJobs(res.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load jobs";
      toast.error(errorMsg);
      console.error("Load jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this print job?")) return;

    try {
      await API.delete(`/print/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success("Print job deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job");
      console.error(err);
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const res = await API.put(`/print/${jobId}`, { status: newStatus });
      const updatedJob = res.data.job || res.data;
      setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, ...updatedJob } : j)));
      toast.success(`Job marked as ${newStatus}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update job status";
      toast.error(errorMsg);
      loadJobs();
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={clsx(
        "min-h-screen py-12 px-4",
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      )}>
        <div className="text-center">
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Loading print jobs...</p>
        </div>
      </div>
    );
  }

  const getStatusClasses = (status) => {
    switch (normalize(status)) {
      case "pending":
        return "bg-amber-100 text-amber-900";
      case "printing":
        return "bg-blue-100 text-blue-900";
      case "completed":
        return "bg-emerald-100 text-emerald-900";
      case "failed":
        return "bg-red-100 text-red-900";
      default:
        return "bg-slate-100 text-slate-900";
    }
  };

  return (
    <div className={clsx(
      "space-y-6",
      isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx("text-3xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
            <Printer size={32} />
            Print Jobs Management
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Monitor and manage all print jobs
          </p>
        </div>
        <button
          onClick={loadJobs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Search */}
      <div className={clsx(
        "rounded-lg p-6 border",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <input
          type="text"
          placeholder="Search by file name or student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={clsx(
            "w-full px-4 py-2.5 rounded-lg border-2 transition-all",
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          )}
        />
      </div>

      {/* Jobs Matrix (Square Cards with Actions) */}
      {filteredJobs.length === 0 ? (
        <div className={clsx(
          "rounded-lg border text-center py-12",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>No print jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className={clsx(
                "aspect-square rounded-xl border p-4 shadow-sm hover:shadow-md transition-all",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", getStatusClasses(job.status))}>
                    {job.status}
                  </span>
                  <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className={clsx("text-sm font-bold line-clamp-2 mb-2", isDark ? "text-white" : "text-slate-900")}>{job.fileName}</p>
                <p className={clsx("text-xs mb-3", isDark ? "text-slate-400" : "text-slate-600")}>{job.userId?.name || "Unknown"}</p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className={isDark ? "text-slate-500" : "text-slate-500"}>Copies</p>
                    <p className={clsx("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>{job.copies}</p>
                  </div>
                  <div>
                    <p className={isDark ? "text-slate-500" : "text-slate-500"}>Paper</p>
                    <p className={clsx("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>{job.pageSize}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-3 border-t border-slate-200/40">
                  {normalize(job.status) === "pending" && (
                    <button
                      onClick={() => updateJobStatus(job._id, "printing")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <Play size={12} /> Start
                    </button>
                  )}
                  {normalize(job.status) === "printing" && (
                    <button
                      onClick={() => updateJobStatus(job._id, "completed")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    >
                      <CheckCircle2 size={12} /> Complete
                    </button>
                  )}
                  {normalize(job.status) !== "completed" && normalize(job.status) !== "failed" && (
                    <button
                      onClick={() => updateJobStatus(job._id, "failed")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      <XCircle size={12} /> Fail
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
