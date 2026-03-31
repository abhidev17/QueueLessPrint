import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Printer, Clock, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import socket from "../socket";
import { useTheme } from "../context/ThemeContext";
import { PageWrapper } from "../components/PageWrapper";
import clsx from "clsx";

export default function StaffDashboard({ user }) {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadJobs();

    // Listen for job updates
    const handleJobUpdated = (updatedJob) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
      );
    };

    // Listen for job completion notifications
    const handleJobCompleted = (data) => {
      toast.info(`✅ ${data.message}`, {
        position: "top-right",
        autoClose: 5000
      });
    };

    socket.on("jobUpdated", handleJobUpdated);
    socket.on("jobCompleted", handleJobCompleted);

    return () => {
      socket.off("jobUpdated", handleJobUpdated);
      socket.off("jobCompleted", handleJobCompleted);
    };
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

  const updateStatus = async (jobId, newStatus) => {
    try {
      const res = await API.put(`/print/${jobId}`, { status: newStatus });
      setJobs(jobs.map(j => (j._id === jobId ? res.data : j)));
      toast.success(`Job marked as ${newStatus}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update job";
      toast.error(errorMsg);
      console.error(err);
      loadJobs();
    }
  };

  // Sort by priority (high > normal > low) then filter
  const sortByPriority = (jobsToSort) => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    return [...jobsToSort].sort((a, b) => {
      const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const prioritySortedJobs = sortByPriority(jobs);
  
  const filteredJobs = prioritySortedJobs.filter(job =>
    filter === "all" ? true : job.status === filter
  );

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === "pending").length,
    printing: jobs.filter(j => j.status === "printing").length,
    completed: jobs.filter(j => j.status === "completed").length
  };

  if (loading) {
    return (
      <div className={clsx(
        "min-h-screen py-12 px-4",
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      )}>
        <div className="text-center">
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className={clsx(
        "space-y-6",
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      )}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className={clsx("text-3xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
            <Printer size={32} />
            Print Queue Management
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Manage and process print jobs
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={clsx(
              "rounded-lg p-6 border",
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-slate-200"
            )}
          >
          <div className="flex items-center justify-between">
            <div>
              <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
                Total Jobs
              </p>
              <p className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {stats.total}
              </p>
            </div>
            <Printer className={isDark ? "text-blue-400" : "text-blue-600"} size={32} />
          </div>
          </motion.div>

        {/* Pending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          className={clsx(
            "rounded-lg p-6 border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
                Pending
              </p>
              <p className={clsx("text-3xl font-bold text-yellow-600", isDark ? "text-yellow-400" : "text-yellow-600")}>
                {stats.pending}
              </p>
            </div>
            <Clock className={isDark ? "text-yellow-400" : "text-yellow-600"} size={32} />
          </div>
        </motion.div>

        {/* Printing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className={clsx(
            "rounded-lg p-6 border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
                Printing
              </p>
              <p className={clsx("text-3xl font-bold text-blue-600", isDark ? "text-blue-400" : "text-blue-600")}>
                {stats.printing}
              </p>
            </div>
            <Zap className={isDark ? "text-blue-400" : "text-blue-600"} size={32} />
          </div>
        </motion.div>

        {/* Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          whileHover={{ scale: 1.05 }}
          className={clsx(
            "rounded-lg p-6 border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-slate-200"
          )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={clsx("text-sm font-medium opacity-75", isDark ? "text-slate-400" : "text-slate-600")}>
                Completed
              </p>
              <p className={clsx("text-3xl font-bold text-green-600", isDark ? "text-green-400" : "text-green-600")}>
                {stats.completed}
              </p>
            </div>
            <CheckCircle className={isDark ? "text-green-400" : "text-green-600"} size={32} />
          </div>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className={clsx(
          "rounded-lg p-6 border flex gap-2 flex-wrap",
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        )}>
        {["all", "pending", "printing", "completed"].map(status => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={clsx(
              "px-4 py-2 rounded-lg font-semibold transition-all capitalize",
              filter === status
                ? isDark
                  ? "bg-cyan-600 text-white"
                  : "bg-cyan-500 text-white"
                : isDark
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            )}
          >
            {status}
          </motion.button>
        ))}
      </motion.div>

      {/* Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className={clsx(
          "rounded-lg overflow-hidden border",
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        )}>
        <table className="w-full">
          <thead className={clsx(
            isDark ? "bg-slate-700" : "bg-slate-100"
          )}>
            <tr>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Student
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                File Name
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Copies
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Color
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Priority
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Status
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={clsx("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
            {filteredJobs.map((job, idx) => (
              <motion.tr
                key={job._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ backgroundColor: isDark ? "rgb(55, 65, 81)" : "rgb(248, 250, 252)" }}
                className={clsx(
                  isDark ? "hover:bg-slate-700" : "hover:bg-slate-50",
                  job.priority === "high"
                    ? isDark
                      ? "bg-red-900/20"
                      : "bg-red-100/50"
                    : ""
                )}>
                <td className={clsx("px-6 py-4 font-medium", isDark ? "text-white" : "text-slate-900")}>
                  {job.userId?.name || "Unknown"}
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {job.fileName}
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {job.copies}
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold",
                    job.color
                      ? isDark
                        ? "bg-red-900 text-red-200"
                        : "bg-red-100 text-red-900"
                      : isDark
                      ? "bg-gray-900 text-gray-200"
                      : "bg-gray-100 text-gray-900"
                  )}>
                    {job.color ? "Color" : "B&W"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold capitalize flex items-center gap-1 w-fit",
                    job.priority === "high"
                      ? isDark
                        ? "bg-red-900 text-red-200"
                        : "bg-red-100 text-red-900"
                      : job.priority === "low"
                      ? isDark
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-200 text-slate-700"
                      : isDark
                      ? "bg-blue-900 text-blue-200"
                      : "bg-blue-100 text-blue-900"
                  )}>
                    {job.priority === "high" ? <AlertCircle size={14} /> : null}
                    {job.priority || "normal"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold capitalize",
                    job.status === "pending"
                      ? isDark
                        ? "bg-yellow-900 text-yellow-200"
                        : "bg-yellow-100 text-yellow-900"
                      : job.status === "printing"
                      ? isDark
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-900"
                      : isDark
                      ? "bg-green-900 text-green-200"
                      : "bg-green-100 text-green-900"
                  )}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {job.status === "pending" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(job._id, "printing")}
                      className={clsx(
                        "px-3 py-1 rounded-lg text-sm font-semibold transition-all",
                        isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      )}
                    >
                      Start
                    </motion.button>
                  )}

                  {job.status === "printing" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(job._id, "completed")}
                      className={clsx(
                        "px-3 py-1 rounded-lg text-sm font-semibold transition-all",
                        isDark
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      )}
                    >
                      Complete
                    </motion.button>
                  )}

                  {job.status === "completed" && (
                    <span className={clsx(
                      "px-3 py-1 rounded-lg text-sm font-semibold inline-block",
                      isDark
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-200 text-slate-600"
                    )}>
                      Done
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredJobs.length === 0 && (
          <div className={clsx(
            "text-center py-12",
            isDark ? "bg-slate-700" : "bg-slate-50"
          )}>
            <p className={isDark ? "text-slate-300" : "text-slate-600"}>
              No {filter !== "all" ? filter : ""} jobs found
            </p>
          </div>
        )}
      </motion.div>
      </div>
    </PageWrapper>
  );
}
