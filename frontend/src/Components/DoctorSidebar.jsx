import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenu, IoClose, IoLogOutOutline } from "react-icons/io5";

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItem = (label, path) => (
    <li
      className={`px-4 py-3 rounded-lg cursor-pointer transition
        ${
          location.pathname.startsWith(path)
            ? "bg-white/30 font-semibold"
            : "hover:bg-white/20"
        }`}
      onClick={() => {
        navigate(path);
        setOpen(false);
      }}
    >
      {label}
    </li>
  );

  return (
    <>
      {/* 🍔 HAMBURGER (MOBILE ONLY) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50
                   bg-blue-600 text-white p-3 rounded-lg shadow-lg"
        onClick={() => setOpen(true)}
      >
        <IoMenu size={24} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[250px] z-50
          bg-gradient-to-b from-cyan-500 to-blue-600 text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 text-xl font-bold">
          Doctor Logbook
          <IoClose
            className="md:hidden cursor-pointer"
            size={24}
            onClick={() => setOpen(false)}
          />
        </div>

        <ul className="space-y-2 px-4">
          {menuItem("Home", "/doctor")}

          {/* ✅ CHANGED HERE */}
          {menuItem("View Students", "/doctor/view-students")}

          {menuItem("Assign Task", "/doctor/assign-task")}
          {menuItem("Student Analysis", "/doctor/student-analysis")}
          {menuItem("Account","/doctor/account")}

          <li
            className="px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-white/20"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <IoLogOutOutline /> Log Out
          </li>
        </ul>
      </aside>
    </>
  );
};

export default DoctorSidebar;
