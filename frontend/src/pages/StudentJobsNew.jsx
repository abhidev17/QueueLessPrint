import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";
import { FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function StudentJobsNew({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status normalization
  const normalize = (s) => s?.toLowerCase() || "";

  useEffect(() => {
    loadJobs();

    const handleJobUpdated = (updatedJob) => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updatedJob._id ? { ...job, ...updatedJob } : job))
      );
    };

    const handleNewJob = (newJob) => {
      // Only add if it belongs to current user
      if (newJob.userId === user?._id) {
        setJobs((prevJobs) => [newJob, ...prevJobs]);
        toast.info("New print job submitted!");
      }
    };

    const handleJobCompleted = (data) => {
      // Show notification if the completed job belongs to current user
      if (data.userId === user?._id) {
        toast.success(`✅ ${data.message}`, {
          position: "top-right",
          autoClose: 5000
        });
        // Update the job status in the list
        setJobs((prevJobs) =>
          prevJobs.map((job) => 
            job.fileName === data.fileName 
              ? { ...job, status: "completed" } 
              : job
          )
        );
      }
    };

    socket.on("jobUpdated", handleJobUpdated);
    socket.on("new-print-job", handleNewJob);
    socket.on("jobCompleted", handleJobCompleted);

    return () => {
      socket.off("jobUpdated", handleJobUpdated);
      socket.off("new-print-job", handleNewJob);
      socket.off("jobCompleted", handleJobCompleted);
    };
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/print/user-jobs");
      setJobs(res.data || []);
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
          <div className="max-w-md mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">📄 Your Jobs</h1>
            <p className="text-cyan-100 text-sm">Track your print submissions</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
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

              {/* Jobs List */}
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job._id} className="bg-white shadow-md rounded-xl p-4 border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span>{job.status}</span>
                      </div>
                      <span className="text-xs text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* File Info */}
                    <p className="text-sm font-bold text-slate-900 truncate mb-2">{job.fileName}</p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 pb-3 border-b border-slate-100">
                      <div>
                        <p className="text-slate-500 font-medium">Copies</p>
                        <p className="font-bold text-slate-900">{job.copies}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Paper</p>
                        <p className="font-bold text-slate-900">{job.pageSize}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Color</p>
                        <p className="font-bold text-slate-900">{job.color ? "🌈 Yes" : "⚫ B&W"}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Priority</p>
                        <p className="font-bold text-slate-900 capitalize">{job.priority || "Normal"}</p>
                      </div>
                    </div>

                    {/* Slot Info */}
                    <div className="text-xs">
                      <p className="text-slate-500 font-medium">📅 {job.printDate} • ⏰ {job.slotTime}</p>
                    </div>
                  </div>
                ))}
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
              <span className="text-xs font-medium">Jobs</span>
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
