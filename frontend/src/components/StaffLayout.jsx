import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";

export function StaffLayout() {
  return (
    <div className="flex h-screen">
      <StaffSidebar />
      <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
}
