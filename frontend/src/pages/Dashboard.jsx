import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FileText, Clock, CheckCircle, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { Card, Skeleton, Badge } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import clsx from "clsx";
import socket from "../socket";

function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    printing: 0,
    completed: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadDashboardData();

    // Socket.IO listeners for real-time updates
    socket.on("new-print-job", handleNewJob);
    socket.on("jobUpdated", handleJobUpdate);

    return () => {
      socket.off("new-print-job", handleNewJob);
      socket.off("jobUpdated", handleJobUpdate);
    };
  }, [user?.role]);

  const loadDashboardData = async () => {
    try {
      const endpoint = isAdmin ? "/print/all" : "/print/user-jobs";
      const res = await API.get(endpoint);
      const jobsData = Array.isArray(res.data) ? res.data : [];

      setJobs(jobsData);
      calculateStats(jobsData);
      generateChartData(jobsData);
      setRecentJobs(jobsData.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobsList) => {
    const newStats = {
      total: jobsList.length,
      pending: jobsList.filter((j) => j?.status === "pending").length,
      printing: jobsList.filter((j) => j?.status === "printing").length,
      completed: jobsList.filter((j) => j?.status === "completed").length,
      failed: jobsList.filter((j) => j?.status === "failed").length,
    };
    setStats(newStats);
  };

  const generateChartData = (jobsList) => {
    const grouped = {};
    jobsList.forEach((job) => {
      const date = new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!grouped[date]) grouped[date] = { date, pending: 0, printing: 0, completed: 0, failed: 0 };
      if (job.status === "pending") grouped[date].pending++;
      if (job.status === "printing") grouped[date].printing++;
      if (job.status === "completed") grouped[date].completed++;
      if (job.status === "failed") grouped[date].failed++;
    });

    setChartData(Object.values(grouped).slice(-7));
  };

  const handleNewJob = (newJob) => {
    if (isAdmin || newJob.userId === user?._id) {
      setJobs((prev) => [newJob, ...prev]);
      calculateStats([newJob, ...jobs]);
      setRecentJobs((prev) => [newJob, ...prev].slice(0, 5));
    }
  };

  const handleJobUpdate = (updatedJob) => {
    setJobs((prev) =>
      prev.map((job) => (job._id === updatedJob._id ? updatedJob : job))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "printing":
        return "info";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const statCards = [
    { label: "Total Jobs", value: stats.total, icon: FileText, color: "blue" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
    { label: "Printing", value: stats.printing, icon: Zap, color: "purple" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "green" },
    { label: "Failed", value: stats.failed || 0, icon: AlertCircle, color: "red" },
  ];

  const chartColors = isDark
    ? { line: "#3b82f6", bar: "#10b981", text: "#e2e8f0" }
    : { line: "#3b82f6", bar: "#10b981", text: "#1e293b" };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
          Welcome back, {user?.name}!
        </h1>
        <p className={clsx("mt-1", isDark ? "text-slate-400" : "text-slate-600")}>
          {isAdmin ? "Manage all print jobs and users" : "Track your print jobs and submissions"}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className={clsx("relative overflow-hidden", loading && "pointer-events-none")}
              hoverable
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={clsx(
                      "text-sm font-semibold",
                      isDark ? "text-slate-400" : "text-slate-600"
                    )}
                  >
                    {stat.label}
                  </p>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className={clsx("text-3xl font-bold mt-2", isDark ? "text-white" : "text-slate-900")}>
                      {stat.value}
                    </p>
                  )}
                </div>
                <div
                  className={clsx(
                    "p-3 rounded-lg",
                    stat.color === "blue" && (isDark ? "bg-blue-900/30" : "bg-blue-100"),
                    stat.color === "yellow" && (isDark ? "bg-yellow-900/30" : "bg-yellow-100"),
                    stat.color === "purple" && (isDark ? "bg-purple-900/30" : "bg-purple-100"),
                    stat.color === "green" && (isDark ? "bg-green-900/30" : "bg-green-100")
                  )}
                >
                  <stat.icon
                    size={24}
                    className={clsx(
                      stat.color === "blue" && "text-blue-500",
                      stat.color === "yellow" && "text-yellow-500",
                      stat.color === "purple" && "text-purple-500",
                      stat.color === "green" && "text-green-500"
                    )}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Jobs Over Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <h3 className={clsx("text-lg font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Jobs Trend
            </h3>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#334155" : "#e2e8f0"}
                  />
                  <XAxis stroke={chartColors.text} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: chartColors.text,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#facc15"
                    strokeWidth={2}
                    dot={{ fill: "#facc15", r: 4 }}
                    name="Pending"
                  />
                  <Line
                    type="monotone"
                    dataKey="printing"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name="Printing"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 4 }}
                    name="Failed"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* Pie Chart - Status Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className={clsx("text-lg font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Status Distribution
            </h3>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Pending", value: stats.pending },
                      { name: "Printing", value: stats.printing },
                      { name: "Completed", value: stats.completed },
                      { name: "Failed", value: stats.failed || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ value }) => value}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#fbbf24" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#34d399" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <h3 className={clsx("text-lg font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
            Recent Print Jobs
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle
                size={48}
                className={isDark ? "text-slate-500" : "text-slate-400"}
              />
              <p className={clsx("ml-4 text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                No print jobs yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={clsx(
                    "p-4 rounded-lg border flex items-center justify-between",
                    isDark ? "border-slate-700 bg-slate-700/30" : "border-slate-200 bg-slate-50"
                  )}
                >
                  <div>
                    <p className={clsx("font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      {job.fileName}
                    </p>
                    <p className={clsx("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
                      {job.copies} copy {job.copies > 1 ? "copies" : ""} • {job.pageSize} • {job.slotTime}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(job.status)}>{job.status}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default Dashboard;
