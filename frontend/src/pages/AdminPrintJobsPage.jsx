import { useState, useEffect } from "react";
import { Printer, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function AdminPrintJobsPage({ user }) {
  const { isDark } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadJobs();
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

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this print job?")) return;

    try {
      await API.delete(`/print/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success("Print job deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job");
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.userId?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={clsx(
        "min-h-screen py-12 px-4",
        isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      )}>
        <div className="text-center">
          <p className={isDark ? "text-slate-300" : "text-slate-600"}>Loading print jobs...</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    "Pending": "bg-amber-100 text-amber-900",
    "Printing": "bg-blue-100 text-blue-900",
    "Completed": "bg-green-100 text-green-900"
  };

  return (
    <div className={clsx(
      "space-y-6",
      isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx("text-3xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
            <Printer size={32} />
            Print Jobs Management
          </h1>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Monitor and manage all print jobs
          </p>
        </div>
        <button
          onClick={loadJobs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Search */}
      <div className={clsx(
        "rounded-lg p-6 border",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}>
        <input
          type="text"
          placeholder="Search by file name or student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={clsx(
            "w-full px-4 py-2.5 rounded-lg border-2 transition-all",
            isDark
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          )}
        />
      </div>

      {/* Jobs Table */}
      <div className={clsx(
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
                File
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Student
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Copies
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Status
              </th>
              <th className={clsx("px-6 py-3 text-left font-semibold", isDark ? "text-slate-200" : "text-slate-900")}>
                Date
              </th>
            </tr>
          </thead>
          <tbody className={clsx("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
            {filteredJobs.map((job) => (
              <tr key={job._id} className={isDark ? "hover:bg-slate-700" : "hover:bg-slate-50"}>
                <td className={clsx("px-6 py-4 font-medium truncate", isDark ? "text-white" : "text-slate-900")}>
                  {job.fileName}
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {job.userId?.name || "Unknown"}
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {job.copies}
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold",
                    isDark
                      ? statusColors[job.status]?.replace("bg-", "bg-opacity-30 ") || "bg-slate-700 text-slate-200"
                      : statusColors[job.status] || "bg-slate-100 text-slate-900"
                  )}>
                    {job.status}
                  </span>
                </td>
                <td className={clsx("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredJobs.length === 0 && (
          <div className={clsx(
            "text-center py-12",
            isDark ? "bg-slate-700" : "bg-slate-50"
          )}>
            <p className={isDark ? "text-slate-300" : "text-slate-600"}>No print jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
