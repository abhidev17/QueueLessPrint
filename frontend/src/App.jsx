import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/common/AppLayout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import StudentPageNew from "./pages/StudentPageNew";
import StudentJobsNew from "./pages/StudentJobsNew";
import AdminPageNew from "./pages/AdminPageNew";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPrintJobsPage from "./pages/AdminPrintJobsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import ErrorBoundary from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

// Protected Route Wrapper
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
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

      <Route
        path="/submit-job"
        element={
          <ProtectedRoute requiredRole="student">
            <AppLayout currentPage="Submit Job">
              <StudentPageNew user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-jobs"
        element={
          <ProtectedRoute requiredRole="student">
            <AppLayout currentPage="My Jobs">
              <StudentJobsNew user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout currentPage="Dashboard">
              <AdminPageNew user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout currentPage="Users">
              <AdminUsersPage user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/print-jobs"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout currentPage="Print Jobs">
              <AdminPrintJobsPage user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute requiredRole="admin">
            <AppLayout currentPage="Reports">
              <AdminReportsPage user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

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
