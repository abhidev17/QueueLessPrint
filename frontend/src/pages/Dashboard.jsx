import { useEffect, useState } from "react";
import { Printer, Clock, CheckCircle, Activity } from "lucide-react";
import API from "../api";

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const endpoint = user?.role === "admin" ? "/print/all" : "/print/user-jobs";
        const res = await API.get(endpoint);
        const jobs = Array.isArray(res.data) ? res.data : [];

        setStats({
          total: jobs.length,
          pending: jobs.filter((job) => job?.status === "Pending").length,
          completed: jobs.filter((job) => job?.status === "Completed").length
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setStats({ total: 0, pending: 0, completed: 0 });
      }
    };

    loadStats();
  }, [user?.role]);

  const cards = [
    {
      label: "Total Jobs",
      value: stats.total,
      icon: Printer,
      tone: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      tone: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      tone: "text-emerald-600 bg-emerald-50 border-emerald-100"
    }
  ];

  return (
    <div>
      <div className="mb-8 pt-12 md:pt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.name}. Here is your print activity snapshot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`border rounded-xl p-6 shadow-sm ${card.tone}`}>
              <Icon size={28} className="mb-3" />
              <h2 className="text-lg font-semibold">{card.label}</h2>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-800 mb-2">
          <Activity size={18} />
          <h3 className="font-semibold">Quick Insight</h3>
        </div>
        <p className="text-slate-600 text-sm">
          {stats.pending > 0
            ? `You currently have ${stats.pending} pending ${stats.pending === 1 ? "job" : "jobs"}.`
            : "No pending print jobs right now. Great job staying on top of your queue."}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
