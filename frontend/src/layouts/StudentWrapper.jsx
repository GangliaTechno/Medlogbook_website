import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";


const StudentWrapper = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="h-full overflow-y-auto ml-0 md:ml-[250px] text-gray-800">
        <div className="p-4 md:p-6 min-h-full bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentWrapper;
