import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";
import { AlertCircle, Loader2, RefreshCw, Printer } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function AdminPageNew({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");

  useEffect(() => {
    loadJobs();

    const handleNewJob = (newJob) => {
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      toast.info("New print job received!");
    };

    const handleJobUpdated = (updatedJob) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
      );
    };

    socket.on("new-print-job", handleNewJob);
    socket.on("jobUpdated", handleJobUpdated);

    return () => {
      socket.off("new-print-job", handleNewJob);
      socket.off("jobUpdated", handleJobUpdated);
    };
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      console.log("Loading jobs with user:", user);
      console.log("Token:", localStorage.getItem("token"));
      const res = await API.get("/print/all");
      setJobs(res.data || []);
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
    switch (status) {
      case "Completed":
        return "bg-emerald-100 border-emerald-300 text-emerald-900";
      case "Printing":
        return "bg-cyan-100 border-cyan-300 text-cyan-900";
      case "Pending":
        return "bg-amber-100 border-amber-300 text-amber-900";
      default:
        return "bg-slate-100 border-slate-300 text-slate-900";
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === "All") return true;
    return job.status === filter;
  });

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === "Pending").length,
    printing: jobs.filter(j => j.status === "Printing").length,
    completed: jobs.filter(j => j.status === "Completed").length
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
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in-up">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Printer size={32} />
                Admin Dashboard
              </h1>
              <p className="text-slate-600">Manage and monitor all print jobs</p>
            </div>
            <button
              onClick={loadJobs}
              className="btn-primary flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger">
            {[
              { label: "Total Jobs", value: stats.total, color: "bg-cyan-100 text-cyan-700" },
              { label: "Pending", value: stats.pending, color: "bg-amber-100 text-amber-700" },
              { label: "Printing", value: stats.printing, color: "bg-sky-100 text-sky-700" },
              { label: "Completed", value: stats.completed, color: "bg-emerald-100 text-emerald-700" }
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.color} rounded-xl p-4 text-center border border-white/60 hover-lift`}>
                <p className="text-sm font-medium opacity-75">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["All", "Pending", "Printing", "Completed"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                {status}
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
                    {filteredJobs.map(job => (
                      <tr key={job._id} className="hover:bg-cyan-50/50 transition-colors">
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
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {job.status !== "Completed" && (
                            <button
                              onClick={() => updateStatus(job._id, "Printing")}
                              className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
                            >
                              Print
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(job._id, "Completed")}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                          >
                            Done
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
            {filteredJobs.map(job => (
              <div key={job._id} className={`card border-2 hover-lift ${getStatusColor(job.status)}`}>
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
                    <button
                      onClick={() => updateStatus(job._id, "Printing")}
                      className="flex-1 px-2 py-1 bg-cyan-100 text-cyan-700 text-sm rounded hover:bg-cyan-200"
                    >
                      Print
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(job._id, "Completed")}
                    className="flex-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-sm rounded hover:bg-emerald-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPageNew;
