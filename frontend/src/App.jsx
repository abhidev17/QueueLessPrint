import { useState, useEffect } from "react";
import LoginPageNew from "./pages/LoginPageNew";
import Sidebar from "./components/Sidebar";
import StudentPageNew from "./pages/StudentPageNew";
import StudentJobsNew from "./pages/StudentJobsNew";
import AdminPageNew from "./pages/AdminPageNew";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("dashboard");
  };

  if (!user) {
    return <LoginPageNew setUser={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
        <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {page === "dashboard" && <Dashboard user={user} key="dashboard" />}
          {page === "student" && <StudentPageNew user={user} key="student" />}
          {page === "jobs" && <StudentJobsNew user={user} key="jobs" />}
          {page === "admin" && <AdminPageNew user={user} key="admin" />}
        </main>
        </div>
    </ErrorBoundary>
  );
}

export default App;
