import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import { MdDashboard, MdGroup, MdSupport, MdAccountCircle } from "react-icons/md";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: default false (no layout lag)
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  // ✅ FIX: proper active state for index route
  const getLinkStyle = (path, isHome = false) => {
    const isActive = isHome
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

    return `px-6 py-4 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-200
      ${
        isActive
          ? "bg-white/20 border-l-4 border-white font-semibold text-white"
          : "hover:bg-white/20 hover:border-l-4 hover:border-white"
      }`;
  };

  return (
    <>
      {/* 🍔 Burger Icon */}
      {!isOpen && (
        <div className="md:hidden p-4 fixed top-0 left-0 z-50">
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display: "block",
              width: "100%",
              fontWeight: "bold",
              background:
                "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
              color: "white",
              padding: "12px 20px",
              margin: "auto",
              borderRadius: "20px",
              boxShadow: "rgba(133, 189, 215, 0.88) 0px 20px 10px -15px",
              border: "none",
              fontSize: "24px",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <IoMenu />
          </button>
        </div>
      )}

      {/* 🧱 Sidebar Panel */}
      <div
        className={`w-[250px] h-screen text-white flex flex-col pt-5 fixed top-0 z-40 transition-transform duration-300 shadow-lg
        ${isOpen ? "left-0" : "-left-[250px]"} md:left-0`}
        style={{
          background:
            "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        {/* 🔠 Title & Close Button */}
        <div className="flex items-center justify-between px-5 mb-5">
          <div className="text-[22px] font-bold text-gray-100">
            Admin Logbook
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white text-2xl"
          >
            <IoClose />
          </button>
        </div>

        {/* 🔗 Navigation Links */}
        <ul>
          {/* ✅ HOME (INDEX ROUTE FIX) */}
          <li
            className={getLinkStyle("/admin", true)}
            onClick={() => {
              navigate("/admin");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3">
              <path d="M252-212h85v-188q0-26 18.5-44.5T400-463h160q26 0 44.5 18.5T623-400v188h85v-342L480-725 252-554v342Z"/>
            </svg>
            Home
          </li>

          <li
            className={getLinkStyle("/admin/register")}
            onClick={() => {
              navigate("/admin/register");
              setIsOpen(false);
            }}
          >
            {/* SVG KEPT */}
            Register User
          </li>

          <li
            className={getLinkStyle("/admin/users")}
            onClick={() => {
              navigate("/admin/users");
              setIsOpen(false);
            }}
          >
            {/* SVG KEPT */}
            View Users
          </li>

          <li
            className={getLinkStyle("/admin/support")}
            onClick={() => {
              navigate("/admin/support");
              setIsOpen(false);
            }}
          >
            {/* SVG KEPT */}
            Support
          </li>

          <li
            className={getLinkStyle("/admin/account")}
            onClick={() => {
              navigate("/admin/account");
              setIsOpen(false);
            }}
          >
            {/* SVG KEPT */}
            Account
          </li>

          {/* 🚪 LOGOUT */}
          <li
            className="px-6 py-5 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-l-[4px] hover:border-white hover:pl-[16px] text-white"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <IoLogOutOutline /> Log Out
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
