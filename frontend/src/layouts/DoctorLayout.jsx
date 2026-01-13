import React from "react";
import { Outlet } from "react-router-dom";
import DoctorSidebar from "../Components/DoctorSidebar";
import doctorBg from "../assets/doc_img.png";

const DoctorLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main content area with background */}
      <main
        className="pt-20 md:pt-6 px-4 md:px-6 md:ml-[250px] min-h-screen overflow-x-hidden overflow-y-auto"
        style={{
          backgroundImage: `url(${doctorBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Content wrapper */}
        <div className="flex-1 w-full max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DoctorLayout;