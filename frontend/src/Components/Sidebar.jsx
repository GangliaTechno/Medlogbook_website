import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";

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

  // 🎯 Active link styling
  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return `px-6 py-4 flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-200
      ${
        isActive
          ? "bg-white/20 border-l-4 border-white pl-4 font-semibold"
          : "hover:bg-white/20 hover:border-l-4 hover:border-white hover:pl-4"
      }`;
  };

  return (
    <>
      {/* 🍔 HAMBURGER (MOBILE ONLY) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50
                   bg-gradient-to-r from-blue-600 to-cyan-500
                   text-white p-3 rounded-xl shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <IoMenu size={24} />
      </button>

      {/* 🌑 OVERLAY (MOBILE ONLY) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 📚 SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[250px]
          bg-gradient-to-br from-blue-600 to-cyan-500
          text-white shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        style={{
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        {/* ❌ CLOSE (MOBILE) */}
        <div className="md:hidden absolute top-4 right-4">
          <IoClose
            size={26}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* 🧠 TITLE */}
        <div className="px-6 py-6 text-2xl font-bold">
          Student Logbook
        </div>

        {/* 📌 MENU */}
        <ul className="flex-1 overflow-y-auto pr-2">
          <li className={getLinkStyle("/logbookpage")} onClick={() => handleNavigate("/logbookpage")}>
            Primary Logbook
          </li>

          <li className={getLinkStyle("/jobs")} onClick={() => handleNavigate("/jobs")}>
            Assignment History
          </li>

          <li className={getLinkStyle("/analysis")} onClick={() => handleNavigate("/analysis")}>
            Analysis
          </li>

          <li className={getLinkStyle("/assigned-tasks")} onClick={() => handleNavigate("/assigned-tasks")}>
            Assigned Tasks
          </li>

          <li className={getLinkStyle("/reports")} onClick={() => handleNavigate("/reports")}>
            Reports
          </li>

          <li className={getLinkStyle("/account")} onClick={() => handleNavigate("/account")}>
            Account
          </li>

          <li className={getLinkStyle("/support")} onClick={() => handleNavigate("/support")}>
            Support
          </li>
        </ul>

        {/* 🚪 LOGOUT */}
        <div
          className="px-6 py-5 cursor-pointer hover:bg-white/20 transition"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
