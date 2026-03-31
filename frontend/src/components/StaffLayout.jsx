import { Outlet, useLocation } from "react-router-dom";
import { AppLayout } from "./common/AppLayout";

const pageMap = {
  "/staff": "Print Queue",
};

export function StaffLayout({ user }) {
  const location = useLocation();
  const currentPage = pageMap[location.pathname] || "Print Queue";

  return (
    <AppLayout currentPage={currentPage}>
      <Outlet />
    </AppLayout>
  );
}
