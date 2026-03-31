import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Printer, Clock, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import useSocket from "../hooks/useSocket";
import { useTheme } from "../context/ThemeContext";
import { PageWrapper } from "../components/PageWrapper";
import clsx from "clsx";

export default function StaffDashboard() {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const normalize = (s) => s?.toLowerCase() || "";

  const handleJobCreated = (newJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    toast.success(`New job: ${newJob.fileName}`);
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
    );
  };

  const handleJobDeleted = (data) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== data.jobId));
  };

  const handleJobsBulkDeleted = (data) => {
    setJobs((prevJobs) => prevJobs.filter((job) => !data.jobIds.includes(job._id)));
  };

  useSocket(handleJobCreated, handleJobUpdated, handleJobDeleted, handleJobsBulkDeleted);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/print/all");
      const jobsData = Array.isArray(res.data) ? res.data : [];
      const validJobs = jobsData.filter((job) => job.userId && job.userId._id);
      setJobs(validJobs);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load jobs";
      toast.error(errorMsg);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId, newStatus) => {
    try {
      const res = await API.put(`/print/${jobId}`, { status: newStatus });
      const updatedJob = res.data.job || res.data;
      setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, ...updatedJob } : j)));
      toast.success(`Job marked as ${newStatus}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update job";
      toast.error(errorMsg);
      loadJobs();
    }
  };

  const sortByPriority = (jobsToSort) => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return [...jobsToSort].sort((a, b) => {
      const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const filteredJobs = sortByPriority(jobs).filter((job) =>
    filter === "all" ? true : normalize(job.status) === filter
  );

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => normalize(j.status) === "pending").length,
    printing: jobs.filter((j) => normalize(j.status) === "printing").length,
    completed: jobs.filter((j) => normalize(j.status) === "completed").length,
    failed: jobs.filter((j) => normalize(j.status) === "failed").length,
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="text-center py-16">
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Loading jobs...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className={clsx("space-y-6", isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100")}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={clsx("text-3xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
            <Printer size={30} />
            Print Queue Management
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>Manage and process print jobs</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "All", value: stats.total, icon: Printer, color: "text-indigo-600 bg-indigo-50" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Printing", value: stats.printing, icon: Zap, color: "text-blue-600 bg-blue-50" },
            { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
            { label: "Failed", value: stats.failed, icon: AlertCircle, color: "text-red-600 bg-red-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={clsx("rounded-xl border p-4", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={clsx("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{item.label}</p>
                    <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{item.value}</p>
                  </div>
                  <div className={clsx("p-2 rounded-lg", item.color)}>
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={clsx("rounded-xl border p-4 flex flex-wrap gap-2", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
          {["all", "pending", "printing", "completed", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-sm font-medium capitalize transition",
                filter === status
                  ? "bg-indigo-600 text-white"
                  : isDark
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredJobs.length === 0 ? (
          <div className={clsx("rounded-xl border py-12 text-center", isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600")}>
            No {filter !== "all" ? filter : ""} jobs found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredJobs.map((job) => (
              <div key={job._id} className={clsx("aspect-square rounded-xl border p-4", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={clsx(
                        "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                        normalize(job.status) === "pending"
                          ? "bg-amber-100 text-amber-900"
                          : normalize(job.status) === "printing"
                          ? "bg-blue-100 text-blue-900"
                          : normalize(job.status) === "completed"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-red-100 text-red-900"
                      )}
                    >
                      {job.status}
                    </span>
                    <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className={clsx("text-sm font-semibold line-clamp-2", isDark ? "text-white" : "text-slate-900")}>{job.fileName}</p>
                  <p className={clsx("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-600")}>{job.userId?.name || "Unknown"}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div>
                      <p className={isDark ? "text-slate-500" : "text-slate-500"}>Copies</p>
                      <p className={clsx("font-medium", isDark ? "text-slate-200" : "text-slate-800")}>{job.copies}</p>
                    </div>
                    <div>
                      <p className={isDark ? "text-slate-500" : "text-slate-500"}>Paper</p>
                      <p className={clsx("font-medium", isDark ? "text-slate-200" : "text-slate-800")}>{job.pageSize}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-200/40 flex flex-wrap gap-2">
                    {normalize(job.status) === "pending" && (
                      <button onClick={() => updateStatus(job._id, "printing")} className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Start</button>
                    )}
                    {normalize(job.status) === "printing" && (
                      <button onClick={() => updateStatus(job._id, "completed")} className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Complete</button>
                    )}
                    {normalize(job.status) !== "completed" && normalize(job.status) !== "failed" && (
                      <button onClick={() => updateStatus(job._id, "failed")} className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Fail</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
