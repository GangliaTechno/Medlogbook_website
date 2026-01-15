import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenu, IoClose, IoLogOutOutline } from "react-icons/io5";
import {
  FaHome,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaUserCog
} from "react-icons/fa";

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItem = (label, path, icon) => {
    const isActive = path === "/doctor"
      ? location.pathname === "/doctor"
      : location.pathname.startsWith(path);

    return (
      <li
        className={`px-4 py-3 rounded-lg cursor-pointer flex items-center gap-3 transition
          ${isActive ? "bg-white/30 font-semibold" : "hover:bg-white/20"}`}
        onClick={() => {
          navigate(path);
          setOpen(false);
        }}
      >
        <span className="text-xl">{icon}</span>
        {label}
      </li>
    );
  };

  return (
    <>
      {/* 🍔 HAMBURGER (MOBILE ONLY) */}
      <button
        onClick={() => setOpen(!open)}
        className="
          md:hidden
          fixed top-4 left-4 z-50
          w-12 h-12
          rounded-full
          bg-gradient-to-br from-blue-600 to-cyan-500
          text-white
          flex items-center justify-center
          shadow-xl
          active:scale-95
          transition-transform
        "
      >
        <IoMenu size={26} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-[250px] z-50
          text-white
          transform transition-transform duration-300 shadow-lg
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{
          backgroundColor: "rgb(35, 125, 195)",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px"
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 text-[22px] font-bold text-gray-100">
          Doctor Logbook
          <IoClose
            className="md:hidden cursor-pointer"
            size={24}
            onClick={() => setOpen(false)}
          />
        </div>

        <ul className="px-2">
          <li
            className={`px-6 py-4 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 text-base
              ${location.pathname === "/doctor"
                ? "bg-white/20 border-l-4 border-white font-semibold text-white"
                : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"}`}
            onClick={() => {
              navigate("/doctor");
              setOpen(false);
            }}
          >
            <FaHome className="text-xl" />
            Home
          </li>

          <li
            className={`px-6 py-4 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 text-base
              ${location.pathname.startsWith("/doctor/view-students")
                ? "bg-white/20 border-l-4 border-white font-semibold text-white"
                : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"}`}
            onClick={() => {
              navigate("/doctor/view-students");
              setOpen(false);
            }}
          >
            <FaUsers className="text-xl" />
            View Students
          </li>

          <li
            className={`px-6 py-4 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 text-base
              ${location.pathname.startsWith("/doctor/assign-task")
                ? "bg-white/20 border-l-4 border-white font-semibold text-white"
                : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"}`}
            onClick={() => {
              navigate("/doctor/assign-task");
              setOpen(false);
            }}
          >
            <FaTasks className="text-xl" />
            Assign Task
          </li>

          <li
            className={`px-6 py-4 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 text-base
              ${location.pathname.startsWith("/doctor/student-analysis")
                ? "bg-white/20 border-l-4 border-white font-semibold text-white"
                : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"}`}
            onClick={() => {
              navigate("/doctor/student-analysis");
              setOpen(false);
            }}
          >
            <FaChartBar className="text-xl" />
            Student Analysis
          </li>

          <li
            className={`px-6 py-4 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 text-base
              ${location.pathname.startsWith("/doctor/account")
                ? "bg-white/20 border-l-4 border-white font-semibold text-white"
                : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"}`}
            onClick={() => {
              navigate("/doctor/account");
              setOpen(false);
            }}
          >
            <FaUserCog className="text-xl" />
            Account
          </li>

          <li
            className="px-6 py-4 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 text-base text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <IoLogOutOutline className="text-xl" />
            Log Out
          </li>
        </ul>
      </aside>
    </>
  );
};

export default DoctorSidebar;