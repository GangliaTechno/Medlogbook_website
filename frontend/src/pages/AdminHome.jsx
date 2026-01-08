import React from "react";
import { ShieldCheck } from "lucide-react";

const AdminHome = () => {
  return (
    <div
      className="w-full min-h-screen relative flex items-start md:items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url('/src/assets/admin_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-white/60"></div>

      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <ShieldCheck size={36} className="text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-4">
          Welcome, Admin!
        </h2>

        <p className="text-gray-700 mb-3">
          Manage users and system efficiently.
        </p>

        <p className="text-gray-700">
          Use <strong>View Users</strong> to approve or reject users.
        </p>

        <p className="mt-4 text-gray-600 font-medium">Thank you!</p>
      </div>
    </div>
  );
};

export default AdminHome;
