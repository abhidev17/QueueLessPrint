import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/common/AppLayout";
import { AdminLayout } from "./components/AdminLayout";
import { StaffLayout } from "./components/StaffLayout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import StudentPageNew from "./pages/StudentPageNew";
import StudentJobsNew from "./pages/StudentJobsNew";
import AdminPageNew from "./pages/AdminPageNew";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPrintJobsPage from "./pages/AdminPrintJobsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminSettings from "./pages/AdminSettings";
import StaffDashboard from "./pages/StaffDashboard";
import StaffJobs from "./pages/StaffJobs";
import StaffSettings from "./pages/StaffSettings";
import { StudentLayout } from "./components/StudentLayout";
import StudentSettings from "./pages/StudentSettings";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

// Protected Route Wrapper with Multiple Roles Support
function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout currentPage="Dashboard">
              <Dashboard user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout currentPage="Dashboard">
              <Dashboard user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Student Routes - Nested */}
      <Route
        path="/dashboard"  
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard user={user} />} />
        <Route path="submit" element={<StudentPageNew user={user} />} />
        <Route path="jobs" element={<StudentJobsNew user={user} />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Admin Routes - Nested */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AdminLayout user={user} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminPageNew user={user} />} />
        <Route path="users" element={<AdminUsersPage user={user} />} />
        <Route path="print-jobs" element={<AdminPrintJobsPage user={user} />} />
        <Route path="reports" element={<AdminReportsPage user={user} />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Staff Routes - Nested */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffLayout user={user} />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard user={user} />} />
        <Route path="jobs" element={<StaffJobs user={user} />} />
        <Route path="settings" element={<StaffSettings user={user} />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
