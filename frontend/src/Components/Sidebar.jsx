import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { IoMenu, IoClose, IoLogOutOutline } from "react-icons/io5";
import {
  FaBook,
  FaHistory,
  FaChartBar,
  FaTasks,
  FaFileAlt,
  FaUserCog,
  FaHeadset
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // 👉 Navigate & close sidebar on mobile
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    { name: "Primary Logbook", path: "/logbookpage", icon: <FaBook /> },
    { name: "Assignment History", path: "/jobs", icon: <FaHistory /> },
    { name: "Analysis", path: "/analysis", icon: <FaChartBar /> },
    { name: "Assigned Tasks", path: "/assigned-tasks", icon: <FaTasks /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "Account", path: "/account", icon: <FaUserCog /> },
    { name: "Support", path: "/support", icon: <FaHeadset /> },
  ];


  return (
    <>
      {/* 🍔 HAMBURGER (MOBILE ONLY) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {/*  OVERLAY (MOBILE ONLY) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[250px]
          text-white shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        style={{
          backgroundColor: "rgb(35, 125, 195)",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        {/*  CLOSE (MOBILE ONLY) */}
        <div className="md:hidden absolute top-4 right-4">
          <IoClose
            size={26}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/*  TITLE */}
        <div className="px-6 py-6 text-[22px] font-bold tracking-tight text-gray-100">
          Student Logbook
        </div>

        {/*  MENU */}
        <ul className="flex-1 overflow-y-auto pr-2 px-2">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`px-6 py-4 flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-200 text-base
                ${location.pathname === item.path
                  ? "bg-white/20 border-l-4 border-white font-semibold text-white"
                  : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"
                }`}
              onClick={() => handleNavigate(item.path)}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </li>
          ))}

          {/* 🚪 LOGOUT */}
          <li
            className="px-6 py-4 flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-300 text-base text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
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

export default Sidebar;
