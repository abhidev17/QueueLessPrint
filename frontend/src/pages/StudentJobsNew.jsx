import { useEffect, useState } from "react";
import API from "../api";
import useSocket from "../hooks/useSocket";
import { FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function StudentJobsNew({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status normalization
  const normalize = (s) => s?.toLowerCase() || "";

  // Real-time socket event listeners (filtered for current user)
  const handleJobCreated = (newJob) => {
    if (newJob.userId === user?._id) {
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      toast.success(`✅ Job submitted: ${newJob.fileName}`);
    }
  };

  const handleJobUpdated = (updatedJob) => {
    if (updatedJob.userId === user?._id) {
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
      );
      toast.info(`📍 Job updated: ${updatedJob.status}`);
    }
  };

  const handleJobDeleted = (data) => {
    // Check if the deleted job belongs to current user
    setJobs((prevJobs) => {
      const updated = prevJobs.filter((job) => job._id !== data.jobId);
      if (updated.length < prevJobs.length) {
        // Job was deleted and it's in our list, so it's ours
        toast.warning(`🗑️ Your job was deleted`);
      }
      return updated;
    });
  };

  const handleJobsBulkDeleted = (data) => {
    setJobs((prevJobs) => {
      const updated = prevJobs.filter((job) => !data.jobIds.includes(job._id));
      if (updated.length < prevJobs.length) {
        toast.warning(`🗑️ ${prevJobs.length - updated.length} of your jobs were removed`);
      }
      return updated;
    });
  };

  // Register socket listeners
  useSocket(handleJobCreated, handleJobUpdated, handleJobDeleted, handleJobsBulkDeleted);

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/print/user-jobs");
      
      // ✅ EXTRA SAFETY: Filter valid jobs
      const validJobs = (res.data || []).filter(job => job && job._id);
      setJobs(validJobs);
    } catch (err) {
      toast.error("Failed to load your jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const normalized = normalize(status);
    switch (normalized) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "printing":
        return "bg-cyan-100 text-cyan-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status) => {
    const normalized = normalize(status);
    switch (normalized) {
      case "completed":
        return <CheckCircle size={20} />;
      case "printing":
        return <Loader2 size={20} className="animate-spin" />;
      case "pending":
        return <AlertCircle size={20} />;
      case "failed":
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white sticky top-0 z-10 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">📄 Your Requests</h1>
            <p className="text-cyan-100 text-sm">Track your print submissions</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
          {jobs.length === 0 ? (
            <div className="bg-white shadow-lg rounded-2xl p-8 text-center mt-8">
              <FileText size={48} className="mx-auto mb-4 text-cyan-400" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Print Jobs</h3>
              <p className="text-sm text-slate-600">Submit your first print job to see it here</p>
            </div>
          ) : (
            <>
              {/* Status Summary Cards */}
              <div className="bg-white shadow-lg rounded-2xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 mb-3">📊 Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    const pending = jobs.filter(j => normalize(j.status) === "pending").length;
                    const printing = jobs.filter(j => normalize(j.status) === "printing").length;
                    const completed = jobs.filter(j => normalize(j.status) === "completed").length;
                    const failed = jobs.filter(j => normalize(j.status) === "failed").length;
                    const total = jobs.length;
                    const completedPercent = total > 0 ? ((completed / total) * 100).toFixed(0) : 0;

                    return (
                      <>
                        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                          <p className="text-xs text-yellow-700 font-medium">Pending</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                          <p className="text-2xl font-bold text-blue-600">{printing}</p>
                          <p className="text-xs text-blue-700 font-medium">Printing</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                          <p className="text-2xl font-bold text-green-600">{completed}</p>
                          <p className="text-xs text-green-700 font-medium">Completed ({completedPercent}%)</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                          <p className="text-2xl font-bold text-red-600">{failed}</p>
                          <p className="text-xs text-red-700 font-medium">Failed</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Requests List - Row Layout */}
              <div className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">
                <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  <span className="col-span-4">File</span>
                  <span className="col-span-1">Copies</span>
                  <span className="col-span-1">Paper</span>
                  <span className="col-span-1">Color</span>
                  <span className="col-span-1">Priority</span>
                  <span className="col-span-2">Date & Slot</span>
                  <span className="col-span-2">Status</span>
                </div>

                <div className="divide-y divide-slate-200">
                  {jobs.map((job) => (
                    <div key={job._id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="md:grid md:grid-cols-12 md:items-center gap-2">
                        <div className="col-span-4 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{job.fileName}</p>
                          <p className="text-xs text-slate-500 md:hidden mt-1">
                            {new Date(job.createdAt).toLocaleDateString()} • {job.slotTime}
                          </p>
                        </div>

                        <div className="col-span-1 text-sm text-slate-700 mt-2 md:mt-0">{job.copies}</div>
                        <div className="col-span-1 text-sm text-slate-700">{job.pageSize}</div>
                        <div className="col-span-1 text-sm text-slate-700">{job.color ? "Yes" : "B/W"}</div>
                        <div className="col-span-1 text-sm text-slate-700 capitalize">{job.priority || "normal"}</div>
                        <div className="col-span-2 text-sm text-slate-700 hidden md:block">{job.printDate} • {job.slotTime}</div>

                        <div className="col-span-2 mt-2 md:mt-0">
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            <span>{job.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl">
          <div className="max-w-md mx-auto flex justify-around py-3 px-4">
            <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors">
              <span className="text-xl">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-cyan-600 bg-cyan-50 p-2 rounded-lg">
              <span className="text-xl">📄</span>
              <span className="text-xs font-medium">Requests</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-600 hover:text-cyan-600 transition-colors">
              <span className="text-xl">👤</span>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentJobsNew;
