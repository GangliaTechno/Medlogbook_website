import AdminSidebar from "../Components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 ml-0 md:ml-[250px]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
