import { Outlet } from "react-router-dom";
import Sidebar from "./StudentSidebar";

export function StudentLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
}
