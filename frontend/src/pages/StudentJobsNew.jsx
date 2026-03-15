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

    socket.on("jobUpdated", handleJobUpdated);

    return () => {
      socket.off("jobUpdated", handleJobUpdated);
    };
  }, []);

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
        return "bg-green-100 text-green-800";
      case "Printing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FileText size={32} />
              Your Print Jobs
            </h1>
            <p className="text-gray-600">Track the status of your submitted print jobs</p>
          </div>

          {jobs.length === 0 ? (
            <div className="card text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Print Jobs Yet</h3>
              <p className="text-gray-600">Start by submitting your first print job</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job._id} className="card hover:shadow-lg transition-shadow">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="text-sm font-medium">{job.status}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">File Name</p>
                      <p className="font-medium text-gray-900 truncate">{job.fileName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Copies</p>
                        <p className="text-lg font-semibold text-indigo-600">{job.copies}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Page Size</p>
                        <p className="text-lg font-semibold text-indigo-600">{job.pageSize}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Color</p>
                        <p className="font-medium">{job.color ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Slot</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock size={16} />
                          {job.slotTime}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Print Date</p>
                      <p className="font-medium">{job.printDate}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
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
