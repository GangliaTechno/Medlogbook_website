import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaHeadset,
  FaUserCog
} from "react-icons/fa";

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

    return `px-6 py-4 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-200 text-base
      ${isActive
        ? "bg-white/20 border-l-4 border-white font-semibold text-white"
        : "text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"
      }`;
  };

  return (
    <>
      {/* 🍔 Burger Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
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
      )}

      <div
        className={`w-[250px] h-screen text-white flex flex-col pt-5 fixed top-0 z-40 transition-transform duration-300 shadow-lg
        ${isOpen ? "left-0" : "-left-[250px]"} md:left-0`}
        style={{
          backgroundColor: "rgb(35, 125, 195)",
          borderTopRightRadius: "30px",
          borderBottomRightRadius: "30px",
          bottom: 0,
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
            <FaHome className="text-xl" />
            Home
          </li>

          <li
            className={getLinkStyle("/admin/register")}
            onClick={() => {
              navigate("/admin/register");
              setIsOpen(false);
            }}
          >
            <FaUserPlus className="text-xl" />
            Register User
          </li>

          <li
            className={getLinkStyle("/admin/users")}
            onClick={() => {
              navigate("/admin/users");
              setIsOpen(false);
            }}
          >
            <FaUsers className="text-xl" />
            View Users
          </li>

          <li
            className={getLinkStyle("/admin/support")}
            onClick={() => {
              navigate("/admin/support");
              setIsOpen(false);
            }}
          >
            <FaHeadset className="text-xl" />
            Support
          </li>

          <li
            className={getLinkStyle("/admin/account")}
            onClick={() => {
              navigate("/admin/account");
              setIsOpen(false);
            }}
          >
            <FaUserCog className="text-xl" />
            Account
          </li>

          {/* 🚪 LOGOUT */}
          <li
            className="px-6 py-4 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-300 text-base text-white/80 hover:bg-white/20 hover:border-l-4 hover:border-white hover:text-white"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <IoLogOutOutline className="text-xl" /> Log Out
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
