import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import useSocket from "../hooks/useSocket";
import { AlertCircle, Loader2, Printer, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { PageWrapper } from "../components/PageWrapper";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";
import { 
  StatusBadge, 
  JobTable, 
  FilterBar, 
  ConfirmModal, 
  EmptyState, 
  LoadingSpinner,
  CardSkeleton 
} from "../components/ui";

function AdminPageNew({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null });
  const [deleting, setDeleting] = useState(false);

  // Status normalization
  const normalize = (s) => s?.toLowerCase() || "";

  // Socket event handlers
  const handleJobCreated = (newJob) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    toast.success(`✅ New job submitted: ${newJob.fileName}`);
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
    );
    toast.info(`📍 Job status updated to ${updatedJob.status}`);
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

  useSocket(handleJobCreated, handleJobUpdated, handleJobDeleted, handleJobsBulkDeleted);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/print/all");
      const validJobs = (res.data || []).filter(job => job.userId && job.userId._id);
      setJobs(validJobs);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load jobs";
      toast.error(errorMsg);
      console.error("Load jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setDeleting(true);
    try {
      await API.delete(`/print/${id}`);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
      toast.success("Job deleted successfully");
      setDeleteModal({ isOpen: false, jobId: null });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete job";
      toast.error(errorMsg);
      console.error("Delete job error:", err);
    } finally {
      setDeleting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/print/status/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      loadJobs();
    } catch (err) {
      toast.error("Failed to update status");
      console.error("Update status error:", err);
    }
  };

  // Filtering and stats
  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filter === "all" || normalize(job.status) === filter;
    const matchesSearch = searchQuery === "" || 
      job.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => normalize(j.status) === "pending").length,
    printing: jobs.filter(j => normalize(j.status) === "printing").length,
    completed: jobs.filter(j => normalize(j.status) === "completed").length,
    failed: jobs.filter(j => normalize(j.status) === "failed").length
  };

  const chartData = [
    { name: "Pending", value: stats.pending, fill: "#f59e0b" },
    { name: "Printing", value: stats.printing, fill: "#0ea5e9" },
    { name: "Completed", value: stats.completed, fill: "#10b981" },
    { name: "Failed", value: stats.failed, fill: "#ef4444" }
  ];

  const statusFilters = [
    { value: "all", label: "All Jobs" },
    { value: "pending", label: "Pending" },
    { value: "printing", label: "Printing" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" }
  ];

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <LoadingSpinner fullPage={false} message="Loading print jobs..." />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ToastContainer position="top-right" autoClose={3000} />
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Print Job"
        message="Are you sure you want to delete this print job? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={deleting}
        onConfirm={() => deleteJob(deleteModal.jobId)}
        onCancel={() => setDeleteModal({ isOpen: false, jobId: null })}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Printer className="text-indigo-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Manage and monitor all print jobs in real-time</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="responsive-grid-2 lg:grid-cols-5 mb-8">
          {[
            { label: "Total Jobs", value: stats.total, icon: Printer, color: "indigo" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "amber" },
            { label: "Printing", value: stats.printing, icon: TrendingUp, color: "blue" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "emerald" },
            { label: "Failed", value: stats.failed, icon: AlertCircle, color: "red" }
          ].map((stat, idx) => {
            const colorClasses = {
              indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
              amber: "from-amber-50 to-amber-100 text-amber-700",
              blue: "from-blue-50 to-blue-100 text-blue-700",
              emerald: "from-emerald-50 to-emerald-100 text-emerald-700",
              red: "from-red-50 to-red-100 text-red-700"
            }[stat.color];

            const Icon = stat.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${colorClasses} rounded-xl p-6 border border-white/60 transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80 mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <Icon size={24} opacity={0.3} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Chart */}
        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-6">Job Status Distribution</h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#f1f5f9", 
                      border: "1px solid #e2e8f0", 
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Filter Bar */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={filter}
          onFilterChange={setFilter}
          filters={statusFilters}
          clearable
        />

        {/* Jobs Table or Empty State */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          {filteredJobs.length === 0 ? (
            <EmptyState 
              type={searchQuery || filter !== "all" ? "search" : "jobs"}
              title={searchQuery ? "No jobs match your search" : `No ${filter} jobs`}
            />
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <JobTable
                  jobs={filteredJobs}
                  showUser={true}
                  onDelete={(id) => setDeleteModal({ isOpen: true, jobId: id })}
                  onUpdate={(id) => {
                    const job = jobs.find(j => j._id === id);
                    if (job && normalize(job.status) !== "completed") {
                      updateStatus(id, "Printing");
                    }
                  }}
                  actions={["delete"]}
                />
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 truncate">{job.fileName}</h3>
                        <p className="text-xs text-slate-500 mt-1">{job.userId?.name || "Unknown"}</p>
                      </div>
                      <StatusBadge status={job.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Copies</p>
                        <p className="font-semibold text-slate-900">{job.copies}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Size</p>
                        <p className="font-semibold text-slate-900">{job.pageSize}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Color</p>
                        <p className="font-semibold text-slate-900">{job.color ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Slot</p>
                        <p className="font-semibold text-slate-900">{job.slotTime}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {normalize(job.status) !== "completed" && (
                        <button
                          onClick={() => updateStatus(job._id, "Printing")}
                          className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors text-sm"
                        >
                          Print
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(job._id, "Completed")}
                        className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors text-sm"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, jobId: job._id })}
                        className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default AdminPageNew;
