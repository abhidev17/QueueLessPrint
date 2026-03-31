import { Outlet, useLocation } from "react-router-dom";
import { AppLayout } from "./common/AppLayout";

const pageMap = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/print-jobs": "Print Jobs",
  "/admin/reports": "Reports",
};

export function AdminLayout({ user }) {
  const location = useLocation();
  const currentPage = pageMap[location.pathname] || "Dashboard";

  return (
    <AppLayout currentPage={currentPage}>
      <Outlet />
    </AppLayout>
  );
}
