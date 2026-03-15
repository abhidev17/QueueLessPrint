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
      tone: "text-cyan-700 bg-cyan-50 border-cyan-200"
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      tone: "text-amber-700 bg-amber-50 border-amber-200"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200"
    }
  ];

  return (
    <div className="fade-in-up">
      <div className="mb-10 pt-12 md:pt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-950">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.name}. Here is your print activity snapshot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`border rounded-2xl p-6 shadow-sm hover-lift ${card.tone}`}>
              <Icon size={28} className="mb-3" />
              <h2 className="text-lg font-semibold">{card.label}</h2>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-r from-white to-cyan-50 rounded-2xl border border-cyan-100 p-6 shadow-sm hover-lift">
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
