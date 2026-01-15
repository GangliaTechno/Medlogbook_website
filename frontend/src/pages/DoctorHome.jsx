import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

const DoctorHome = () => {
  const navigate = useNavigate();

  return (
    <div className="font-['Manrope'] min-h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 sm:p-10">

      {/* Welcome Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 max-w-3xl w-full text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Welcome, <span className="text-blue-600">Doctor!</span>
        </h1>

        <p className="text-slate-600 text-lg sm:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
          Your expertise shapes the future. Monitor student progress, review logbook entries, and provide the feedback they need to excel in their medical training.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/doctor/categories")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 w-full sm:w-auto"
          >
            <FaChevronRight />
            Manage Categories
          </button>
          <button
            onClick={() => navigate("/doctor/view-students")}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-xl text-lg font-bold shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-auto"
          >
            View Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
