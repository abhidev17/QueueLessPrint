import { useEffect, useState } from "react";
import { Printer, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function StaffJobs() {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get("/print/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      toast.error("Failed to load print jobs");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />;
      case "processing":
        return <Clock className="text-blue-500 animate-spin" size={20} />;
      case "failed":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Printer className="text-gray-500" size={20} />;
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Print Jobs</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Manage and monitor all print jobs
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "pending", "processing", "completed", "failed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={clsx(
              "px-4 py-2 rounded-lg transition-colors capitalize font-medium",
              filter === status
                ? "bg-blue-600 text-white"
                : isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className={clsx(
        "rounded-lg border",
        isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      )}>
        {loading ? (
          <div className="p-8 text-center">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Loading jobs...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              No jobs found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={clsx(
                  "border-b",
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-100 border-gray-200"
                )}>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job._id}
                    className={clsx(
                      "border-b transition-colors",
                      isDark
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <td className="px-6 py-4 text-sm">{job.filename}</td>
                    <td className="px-6 py-4 text-sm">{job.userId?.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="capitalize text-sm">{job.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
