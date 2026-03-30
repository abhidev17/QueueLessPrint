import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import API from "../api";
import clsx from "clsx";

export default function AdminReportsPage() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    pendingJobs: 0,
    completedJobs: 0,
    statusData: [
      { name: "Pending", value: 0 },
      { name: "Printing", value: 0 },
      { name: "Completed", value: 0 }
    ]
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const jobsRes = await API.get("/print/all");
      const jobs = jobsRes.data || [];
      
      const statusData = [
        { name: "Pending", value: jobs.filter(j => j.status === "Pending").length },
        { name: "Printing", value: jobs.filter(j => j.status === "Printing").length },
        { name: "Completed", value: jobs.filter(j => j.status === "Completed").length }
      ];

      setStats({
        totalJobs: jobs.length,
        pendingJobs: statusData[0].value,
        completedJobs: statusData[2].value,
        statusData
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const COLORS = {
    Pending: "#fbbf24",
    Printing: "#3b82f6",
    Completed: "#10b981"
  };

  return (
    <div className={clsx(
      "space-y-6",
      isDark ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
    )}>
      {/* Header */}
      <div>
        <h1 className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>
          Reports & Analytics
        </h1>
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          System statistics and performance metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Jobs", value: stats.totalJobs, color: "bg-blue-100 text-blue-700" },
          { label: "Pending", value: stats.pendingJobs, color: "bg-amber-100 text-amber-700" },
          { label: "Printing", value: 0, color: "bg-cyan-100 text-cyan-700" },
          { label: "Completed", value: stats.completedJobs, color: "bg-green-100 text-green-700" }
        ].map((stat, idx) => (
          <div key={idx} className={clsx(
            "rounded-lg p-6 border",
            isDark
              ? "bg-slate-800 border-slate-700"
              : `${stat.color} border-opacity-50 bg-opacity-20 border`
          )}>
            <p className={clsx(
              "text-sm font-medium opacity-75",
              isDark ? "text-slate-400" : "text-slate-600"
            )}>
              {stat.label}
            </p>
            <p className={clsx(
              "text-3xl font-bold",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className={clsx(
          "rounded-lg p-6 border",
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        )}>
          <h2 className={clsx("font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
            Job Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className={clsx(
          "rounded-lg p-6 border",
          isDark
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        )}>
          <h2 className={clsx("font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>System Uptime</span>
                <span className="font-bold text-green-600">99.9%</span>
              </div>
              <div className={clsx("h-2 rounded-full", isDark ? "bg-slate-700" : "bg-slate-200")}>
                <div className="h-2 rounded-full bg-green-500" style={{ width: "99.9%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>Job Completion Rate</span>
                <span className="font-bold text-blue-600">85%</span>
              </div>
              <div className={clsx("h-2 rounded-full", isDark ? "bg-slate-700" : "bg-slate-200")}>
                <div className="h-2 rounded-full bg-blue-500" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? "text-slate-300" : "text-slate-700"}>API Response Time</span>
                <span className="font-bold text-amber-600">245ms</span>
              </div>
              <div className={clsx("h-2 rounded-full", isDark ? "bg-slate-700" : "bg-slate-200")}>
                <div className="h-2 rounded-full bg-amber-500" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
