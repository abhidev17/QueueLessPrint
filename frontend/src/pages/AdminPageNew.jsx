import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import useSocket from "../hooks/useSocket";
import { AlertCircle, Loader2, Printer } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { PageWrapper } from "../components/PageWrapper";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function AdminPageNew({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Status normalization
  const normalize = (s) => s?.toLowerCase() || "";

  // Real-time socket event listeners
  const handleJobCreated = (newJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    toast.success(`✅ New job: ${newJob.fileName}`);
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
    );
    toast.info(`📍 Job updated: ${updatedJob.status}`);
  };

  const handleJobDeleted = (data) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job._id !== data.jobId));
    toast.warning(`🗑️ Job deleted`);
  };

  const handleJobsBulkDeleted = (data) => {
    setJobs((prevJobs) =>
      prevJobs.filter((job) => !data.jobIds.includes(job._id))
    );
    toast.warning(`🗑️ ${data.jobIds.length} jobs removed (cleanup)`);
  };

  // Register socket listeners
  useSocket(handleJobCreated, handleJobUpdated, handleJobDeleted, handleJobsBulkDeleted);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      console.log("Loading jobs with user:", user);
      console.log("Token:", localStorage.getItem("token"));
      const res = await API.get("/print/all");
      
      // ✅ EXTRA SAFETY: Filter out jobs with null/undefined userId (deleted users)
      const validJobs = (res.data || []).filter(job => job.userId && job.userId._id);
      setJobs(validJobs);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Unknown error";
      toast.error(`Failed to load jobs: ${errorMsg}`);
      console.error("Load jobs error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data,
        error: err
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/print/status/${id}`, { status });
      toast.success(`Job status updated to ${status}`);
      loadJobs();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const normalized = normalize(status);
    switch (normalized) {
      case "completed":
        return "bg-emerald-100 border-emerald-300 text-emerald-900";
      case "printing":
        return "bg-cyan-100 border-cyan-300 text-cyan-900";
      case "pending":
        return "bg-amber-100 border-amber-300 text-amber-900";
      case "failed":
        return "bg-red-100 border-red-300 text-red-900";
      default:
        return "bg-slate-100 border-slate-300 text-slate-900";
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === "all") return true;
    return normalize(job.status) === filter;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => normalize(j.status) === "pending").length,
    printing: jobs.filter(j => normalize(j.status) === "printing").length,
    completed: jobs.filter(j => normalize(j.status) === "completed").length,
    failed: jobs.filter(j => normalize(j.status) === "failed").length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Printer size={32} />
                Admin Dashboard
              </h1>
              <p className="text-slate-600">Manage and monitor all print jobs</p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total Jobs", value: stats.total, color: "bg-cyan-100 text-cyan-700" },
              { label: "Pending", value: stats.pending, color: "bg-amber-100 text-amber-700" },
              { label: "Printing", value: stats.printing, color: "bg-sky-100 text-sky-700" },
              { label: "Completed", value: stats.completed, color: "bg-emerald-100 text-emerald-700" },
              { label: "Failed", value: stats.failed, color: "bg-red-100 text-red-700" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${stat.color} rounded-xl p-4 text-center border border-white/60 cursor-pointer transition-shadow hover:shadow-lg`}
              >
                <p className="text-sm font-medium opacity-75">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Analytics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-cyan-100"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">📊 Job Status Analytics</h2>
            <div className="w-full h-80">
              {jobs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Pending", value: stats.pending, fill: "#f59e0b" },
                      { name: "Printing", value: stats.printing, fill: "#0ea5e9" },
                      { name: "Completed", value: stats.completed, fill: "#10b981" },
                      { name: "Failed", value: stats.failed, fill: "#ef4444" }
                    ]}
                  >
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {[
                        { name: "Pending", fill: "#f59e0b" },
                        { name: "Printing", fill: "#0ea5e9" },
                        { name: "Completed", fill: "#10b981" },
                        { name: "Failed", fill: "#ef4444" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>No job data available</p>
                </div>
              )}
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm text-slate-600 font-medium">Avg Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(0) : 0}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 font-medium">Avg Printing</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total > 0 ? ((stats.printing / stats.total) * 100).toFixed(0) : 0}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0}%</p>
              </div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["all", "pending", "printing", "completed", "failed"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Jobs Table / Cards */}
          {filteredJobs.length === 0 ? (
            <div className="card text-center py-12">
              <AlertCircle size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Jobs Found</h3>
              <p className="text-slate-600">No print jobs in this category</p>
            </div>
          ) : (
            <div className="hidden lg:block">
              {/* Desktop Table */}
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-cyan-50 border-b border-cyan-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Student</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">File</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Details</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Slot</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredJobs.map((job, idx) => (
                      <motion.tr
                        key={job._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(0, 188, 212, 0.1)" }}
                        className="hover:bg-cyan-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {job.userId?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 truncate">
                          {job.fileName}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex gap-2 text-xs">
                            <span className="bg-slate-100 px-2 py-1 rounded">{job.copies}x</span>
                            <span className="bg-slate-100 px-2 py-1 rounded">{job.pageSize}</span>
                            <span className="bg-slate-100 px-2 py-1 rounded">{job.color ? "Color" : "B&W"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {job.slotTime}
                        </td>
                        <td className="px-6 py-4">
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {job.status !== "Completed" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateStatus(job._id, "Printing")}
                              className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
                            >
                              Print
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(job._id, "Completed")}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                          >
                            Done
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredJobs.map((job, idx) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`card border-2 ${getStatusColor(job.status)}`}
              >
                <div className="mb-3">
                  <p className="text-xs text-slate-600 uppercase tracking-wide">Student</p>
                  <p className="font-semibold text-slate-900">{job.userId?.name || "Unknown"}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-slate-600 uppercase tracking-wide">File</p>
                  <p className="font-medium text-slate-800 truncate">{job.fileName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-600">Copies: {job.copies}</p>
                    <p className="text-xs text-slate-600">Size: {job.pageSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Color: {job.color ? "Yes" : "No"}</p>
                    <p className="text-xs text-slate-600">Slot: {job.slotTime}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  {job.status !== "Completed" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(job._id, "Printing")}
                      className="flex-1 px-2 py-1 bg-cyan-100 text-cyan-700 text-sm rounded hover:bg-cyan-200"
                    >
                      Print
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateStatus(job._id, "Completed")}
                    className="flex-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm rounded hover:bg-emerald-200"
                  >
                    Done
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default AdminPageNew;
