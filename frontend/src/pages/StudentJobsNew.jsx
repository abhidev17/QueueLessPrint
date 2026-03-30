import { useEffect, useState } from "react";
import API from "../api";
import socket from "../socket";
import { FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

function StudentJobsNew({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800";
      case "Printing":
        return "bg-cyan-100 text-cyan-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={20} />;
      case "Printing":
        return <Loader2 size={20} className="animate-spin" />;
      case "Pending":
        return <AlertCircle size={20} />;
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 fade-in-up">
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText size={32} />
              Your Print Jobs
            </h1>
            <p className="text-slate-600">Track the status of your submitted print jobs</p>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center py-12 fade-in-up">
              <FileText size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Print Jobs Yet</h3>
              <p className="text-slate-600">Start by submitting your first print job</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {jobs.map(job => (
                <div key={job._id} className="card hover:shadow-lg hover:shadow-cyan-100 transition-shadow hover-lift">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="text-sm font-medium">{job.status}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide">File Name</p>
                      <p className="font-medium text-slate-900 truncate">{job.fileName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Copies</p>
                        <p className="text-lg font-semibold text-cyan-700">{job.copies}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Page Size</p>
                        <p className="text-lg font-semibold text-cyan-700">{job.pageSize}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Color</p>
                        <p className="font-medium">{job.color ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">Slot</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock size={16} />
                          {job.slotTime}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-600 uppercase tracking-wide">Print Date</p>
                      <p className="font-medium">{job.printDate}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <p>ID: {job._id.slice(0, 8)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentJobsNew;
