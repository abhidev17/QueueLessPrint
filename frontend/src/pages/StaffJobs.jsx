import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Printer, Clock, Zap, CheckCircle2, AlertCircle, Play, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import useSocket from "../hooks/useSocket";
import { useTheme } from "../context/ThemeContext";
import { PageWrapper } from "../components/PageWrapper";
import { FilterBar, EmptyState, LoadingSpinner } from "../components/ui";
import clsx from "clsx";

export default function StaffJobs() {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Status normalization
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
      const response = await API.get("/print/all");
      const jobsData = Array.isArray(response.data) ? response.data : [];
      const validJobs = jobsData.filter((job) => job.userId && job.userId._id);
      setJobs(validJobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      toast.error("Failed to load print jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const response = await API.put(`/print/${jobId}`, { status: newStatus });
      const updatedJob = response.data.job || response.data;
      setJobs(jobs.map(job => job._id === jobId ? updatedJob : job));
      toast.success(`Job marked as ${newStatus}`);
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update job status");
      loadJobs();
    }
  };

  const filteredJobs = (jobs || []).filter((job) => {
    const statusMatch = filter === "all" || normalize(job?.status) === filter;
    const searchMatch =
      !searchQuery ||
      job?.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job?.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => normalize(j.status) === "pending").length,
    printing: jobs.filter((j) => normalize(j.status) === "printing").length,
    completed: jobs.filter((j) => normalize(j.status) === "completed").length,
    failed: jobs.filter((j) => normalize(j.status) === "failed").length,
  };

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "printing", label: "Printing" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

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
    <PageWrapper>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx("rounded-2xl border p-6", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
        >
          <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>Print Jobs</h1>
          <p className={clsx("text-base", isDark ? "text-slate-400" : "text-slate-600")}>Manage and monitor all print jobs</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "All", value: stats.total, icon: Printer, color: "text-indigo-600 bg-indigo-50" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Printing", value: stats.printing, icon: Zap, color: "text-blue-600 bg-blue-50" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
            { label: "Failed", value: stats.failed, icon: AlertCircle, color: "text-red-600 bg-red-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={clsx("rounded-xl border p-4", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={clsx("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{item.label}</p>
                    <p className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{item.value}</p>
                  </div>
                  <div className={clsx("p-2 rounded-lg", item.color)}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={filter}
          onFilterChange={setFilter}
          filters={statusFilters}
        />

        {loading ? (
          <div className={clsx("rounded-xl border p-8", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
            <LoadingSpinner message="Loading print jobs..." />
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState type="jobs" title="No print jobs found" message="Try changing filters or wait for new jobs to arrive." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className={clsx(
                  "rounded-xl border p-3.5 h-[220px] shadow-sm hover:shadow-md transition-all",
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                )}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", getStatusClasses(job.status))}>
                      {job.status}
                    </span>
                    <span className={clsx("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p
                    title={job.fileName}
                    className={clsx("text-[13px] font-bold line-clamp-2 min-h-[2.3rem] mb-1.5", isDark ? "text-white" : "text-slate-900")}
                  >
                    {job.fileName}
                  </p>
                  <p className={clsx("text-[11px] mb-2.5 min-h-[1rem] truncate", isDark ? "text-slate-400" : "text-slate-600")}>{job.userId?.name || "Unknown"}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-2.5 min-h-[2.75rem]">
                    <div>
                      <p className={isDark ? "text-slate-500" : "text-slate-500"}>Copies</p>
                      <p className={clsx("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>{job.copies}</p>
                    </div>
                    <div>
                      <p className={isDark ? "text-slate-500" : "text-slate-500"}>Paper</p>
                      <p className={clsx("font-semibold", isDark ? "text-slate-200" : "text-slate-800")}>{job.pageSize}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2.5 border-t border-slate-200/40 flex flex-wrap gap-1.5">
                    {normalize(job.status) === "pending" && (
                      <button
                        onClick={() => updateJobStatus(job._id, "printing")}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        <Play size={12} /> Start
                      </button>
                    )}
                    {normalize(job.status) === "printing" && (
                      <button
                        onClick={() => updateJobStatus(job._id, "completed")}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        <CheckCircle2 size={12} /> Complete
                      </button>
                    )}
                    {normalize(job.status) !== "completed" && normalize(job.status) !== "failed" && (
                      <button
                        onClick={() => updateJobStatus(job._id, "failed")}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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
    </PageWrapper>
  );
}
