import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import { MdDashboard, MdGroup, MdSupport, MdAccountCircle } from "react-icons/md";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

const getLinkStyle = (path) => {
  const isActive = location.pathname === path;
  return `px-6 py-4 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-300
    ${
      isActive
        ? "bg-white/20 border-l-[4px] border-white pl-[16px] font-semibold text-white"
        : "hover:bg-white/20 hover:border-l-[4px] hover:border-white hover:pl-[16px]"
    }`;
};


  return (
    <>
      {/* 🍔 Burger Icon - Show only when sidebar is closed */}
      {!isOpen && (
        <div className="md:hidden p-4 fixed top-0 left-0 z-50">
          <button onClick={() => setIsOpen(true)} 
          style={{
              display: "block",
              width: "100%",
              fontWeight: "bold",
              background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
              color: "white",
              padding: "12px 20px",
              margin: "auto",
              borderRadius: "20px",
              boxShadow: "rgba(133, 189, 215, 0.88) 0px 20px 10px -15px",
              border: "none",
              fontSize: "24px",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {isOpen ? <IoClose /> : <IoMenu />}
            
          </button>
        </div>
      )}

      {/* 🧱 Sidebar Panel */}
       <div
  className={`w-[250px] h-screen text-white flex flex-col pt-5 fixed top-0 z-40 transition-transform duration-300 shadow-lg
  ${isOpen ? "left-0" : "-left-[250px]"} md:left-0`}
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
  }}
>
        {/* 🔠 Title & Close Button */}
        <div className="flex items-center justify-between px-5 mb-5">
          <div className="text-[22px] font-bold text-gray-100">Admin Logbook</div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-white text-2xl">
            <IoClose />
          </button>
        </div>

        {/* 🔗 Navigation Links */}
        <ul>
          <li
            className={getLinkStyle("/admin/home")}
            onClick={() => {
              navigate("/admin/home");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M252-212h85v-188q0-26 18.5-44.5T400-463h160q26 0 44.5 18.5T623-400v188h85v-342L480-725 252-554v342Zm-126 0v-342q0-29.75 13-56.38Q152-637 176-655l228-171q34-26 76-26t76 26l228 171q24 18 37 44.62 13 26.63 13 56.38v342q0 53-36.5 89.5T708-86H575q-26 0-44.5-18.5T512-149v-203h-64v203q0 26-18.5 44.5T385-86H252q-53 0-89.5-36.5T126-212Zm354-257Z"/></svg> Home
          </li>
          <li
  className={getLinkStyle("/admin/register")}
  onClick={() => {
    navigate("/admin/register");
    setIsOpen(false);
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M738-555h-64q-20.4 0-34.2-13.8Q626-582.6 626-603q0-20.4 13.8-34.2Q653.6-651 674-651h64v-64q0-20.4 13.8-34.2Q765.6-763 786-763q20.4 0 34.2 13.8Q834-735.4 834-715v64h64q20.4 0 34.2 13.8Q946-623.4 946-603q0 20.4-13.8 34.2Q918.4-555 898-555h-64v64q0 20.4-13.8 34.2Q806.4-443 786-443q-20.4 0-34.2-13.8Q738-470.6 738-491v-64Zm-375 58q-81 0-137.5-56.5T169-691q0-81 56.5-137T363-884q81 0 137.5 56T557-691q0 81-56.5 137.5T363-497ZM9-235v-22q0-43.3 22.7-79.6Q54.39-372.9 92-392q65-32 132.96-48.5Q292.92-457 363-457q72 0 140 16t131 48q37.61 18.96 60.3 54.98Q717-302 717-257v22q0 53-36.5 89.5T591-109H135q-53 0-89.5-36.5T9-235Zm126 0h456v-17q0-10.03-5.5-18.24-5.5-8.2-14.5-12.76-48-23-100-35.5T363-331q-54 0-108 12.5T155-283q-9 4.56-14.5 12.76-5.5 8.21-5.5 18.24v17Zm227.96-388Q391-623 411-642.96q20-19.97 20-48 0-28.04-19.96-47.54-19.97-19.5-48-19.5Q335-758 315-738.32T295-691q0 28.05 19.96 48.03 19.97 19.97 48 19.97Zm.04-68Zm0 456Z"/></svg> Register User
</li>

          <li
            className={getLinkStyle("/admin/users")}
            onClick={() => {
              navigate("/admin/users");
              setIsOpen(false);
            }}
          >
           <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M47-224q-26 0-44.5-18.5T-16-287v-16q0-51 49-82t127-31h17q-17 25-25 52.86T144-305v81H47Zm240 0q-26 0-44.5-18.5T224-287v-18q0-35 18-65t53-52q35-22 82-33t102.96-11q57.04 0 103.54 11 46.5 11 81.5 33t53 52q18 30 18 65v18q0 26-18.5 44.5T673-224H287Zm529 0v-81q0-31.37-8-59.12-8-27.75-24-51.88h16q79.2 0 127.6 30.87Q976-354.26 976-303v16q0 26-18.5 44.5T913-224h-97ZM354-331h253q-21-13-56-21t-70.5-8q-35.5 0-71 8T354-331ZM160.09-452Q123-452 96.5-478.39 70-504.77 70-541.82 70-580 96.39-606q26.38-26 63.43-26Q198-632 224-606.15q26 25.85 26 64.06 0 37.09-25.85 63.59T160.09-452Zm640 0q-37.09 0-63.59-26.39-26.5-26.38-26.5-63.43Q710-580 736.39-606q26.38-26 63.43-26Q838-632 864-606.15q26 25.85 26 64.06 0 37.09-25.85 63.59T800.09-452ZM480-495q-56.67 0-96.33-39.67Q344-574.33 344-631q0-57 39.67-96.5Q423.33-767 480-767q57 0 96.5 39.5T616-631q0 56.67-39.5 96.33Q537-495 480-495Zm.5-106q12.5 0 21-9t8.5-21.5q0-12.5-8.62-21-8.63-8.5-21.38-8.5-12 0-21 8.62-9 8.63-9 21.38 0 12 9 21t21.5 9Zm.5 270Zm-1-300Z"/></svg>View Users
          </li>
          <li
            className={getLinkStyle("/admin/support")}
            onClick={() => {
              navigate("/admin/support");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="m432-171-13-1q-148-17-246.5-126.5T74-557q0-161 112.5-272.5T460-941q80 0 150 30.5t122.5 83Q785-775 815.5-705T846-555q0 157-93 278.5T523-71q-15 8-30.5 7.5T463-72q-14-8-22-21.5t-8-30.5l-1-47Zm128-70q71-60 115.5-140.5T720-555q0-109-75.5-184.5T460-815q-109 0-184.5 75.5T200-555q0 109 75.5 184.5T460-295h100v54Zm-100-85q23 0 38.5-15.5T514-380q0-23-15.5-38.5T460-434q-23 0-38.5 15.5T406-380q0 23 15.5 38.5T460-326Zm-92-309q16 6 31.5 0t26.5-20q8-9 16.5-13.5T462-673q17 0 28.5 10t11.5 24q0 12-8 26t-22 27q-23 21-38 44t-15 40q0 17 11.5 28.5T459-462q14 0 25-9.5t19-22.5q8-15 17-28t17-21q29-32 40-53t11-47q0-51-32.5-81T469-754q-37 0-68 15t-47 40q-11 18-7.5 37.5T368-635Zm92 107Z"/></svg> Support
          </li>
          <li
            className={getLinkStyle("/admin/account")}
            onClick={() => {
              navigate("/admin/account");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M239-291q51-37 112-57.5T480.22-369q68.21 0 130.5 22Q673-325 721-290q32-42 49.5-88.5T788-480q0-127-90.5-217.5T480-788q-127 0-217.5 90.5T172-480q0 54 17 100.5t50 88.5Zm241-140q-63 0-105.5-42T332-578q0-63 42.5-105.5T480-726q63 0 105.5 42.5T628-578q0 63-42.5 105T480-431Zm-.08 385Q390-46 311-80q-79-34-138-93T80-311.08q-34-79.09-34-169Q46-570 80-649q34-79 93-138t138.08-93q79.09-34 169-34Q570-914 649-880q79 34 138 93t93 138.08q34 79.09 34 169Q914-390 880-311q-34 79-93 138T648.92-80q-79.09 34-169 34Zm.08-126q48 0 89-13t80-38q-41-26-79.5-38.5T480-274q-51 0-89 12.5T312-223q39 25 79.5 38t88.5 13Zm0-354q22 0 37-15t15-37q0-22-15-37.5T480-631q-22 0-37 15.5T428-578q0 22 15 37t37 15Zm0-52Zm1 355Z"/></svg> Account
          </li>
          <li
            className="px-6 py-5 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-l-[4px] hover:border-white hover:pl-[16px] text-white"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M212-86q-53 0-89.5-36.5T86-212v-536q0-53 36.5-89.5T212-874h213q26 0 44.5 18.5T488-811q0 26-18.5 44.5T425-748H212v536h213q26 0 44.5 18.5T488-149q0 26-18.5 44.5T425-86H212Zm423-331H415q-26 0-44.5-18.5T352-480q0-26 18.5-44.5T415-543h220l-52-52q-18-18-18-44t18-44q18-19 43.5-19t44.5 19l159 159q18 19 18 44t-18 44L671-277q-18 19-44 19t-44-19q-18-18-18-44t18-44l52-52Z"/></svg> Log Out
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;