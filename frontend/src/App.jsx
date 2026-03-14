import { useState, useEffect } from "react";
import LoginPageNew from "./pages/LoginPageNew";
import Navbar from "./components/Navbar";
import StudentPageNew from "./pages/StudentPageNew";
import StudentJobsNew from "./pages/StudentJobsNew";
import AdminPageNew from "./pages/AdminPageNew";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("student");

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
    if (userData.role === "admin") {
      setPage("admin");
    } else {
      setPage("student");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setPage("student");
  };

  if (!user) {
    return <LoginPageNew setUser={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar setPage={setPage} user={user} onLogout={handleLogout} />
        <div>
          {page === "student" && <StudentPageNew user={user} key="student" />}
          {page === "jobs" && <StudentJobsNew user={user} key="jobs" />}
          {page === "admin" && <AdminPageNew user={user} key="admin" />}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
