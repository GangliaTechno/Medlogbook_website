// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
// import { FaHome, FaUserGraduate } from "react-icons/fa";

// const DoctorSidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   const getLinkStyle = (path) => {
//     const isActive = location.pathname === path;
//     return `px-6 py-4 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-300
//       ${isActive ? "bg-teal-800 font-semibold" : "hover:bg-white/20 hover:border-l-[4px] hover:border-[#3498db] hover:pl-[16px]"}`;
//   };

//   return (
//     <>
//       {/* Burger Icon */}
//       <div className="md:hidden p-4 fixed top-0 left-0 z-50">
//         <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl">
//           {isOpen ? <IoClose className="ml-50 -mt-4" /> : <IoMenu />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div
//         className={`bg-[#008080] w-[250px] h-screen text-white flex flex-col pt-5 fixed top-0 z-40 transition-transform duration-300 shadow-lg
//         ${isOpen ? "left-0" : "-left-[250px]"} md:left-0`}
//       >
//         <div className="pl-5 text-[22px] font-bold mb-5 text-gray-100">Doctor Logbook</div>
//         <ul>
//           <li
//             className={getLinkStyle("/doctor-home")}
//             onClick={() => {
//               navigate("/doctor-home");
//               setIsOpen(false);
//             }}
//           >
//             <FaHome className="icon" /> Home
//           </li>
//           <li
//             className={getLinkStyle("/doctor-logbook")}
//             onClick={() => {
//               navigate("/doctor-logbook");
//               setIsOpen(false);
//             }}
//           >
//             <FaUserGraduate className="icon" /> View Students
//           </li>

//           <li onClick={() => { navigate("/doctor-student-analysis"); setIsOpen(false); }}>
//     <FaUserGraduate className="icon" /> Analysis
//   </li>
//   <li onClick={() => { navigate("/assign-task"); setIsOpen(false); }}>
//   <FaUserGraduate className="icon" /> Assign Task
// </li>

//           <li onClick={() => { navigate("/account"); setIsOpen(false); }}>

//           <li
//             className={getLinkStyle("/account")}
//             onClick={() => {
//               navigate("/account");
//               setIsOpen(false);
//             }}
//           >

//             <FaUserGraduate className="icon" /> Account
//           </li>
//           <li
//             className="px-6 py-5 flex gap-3 items-center cursor-pointer rounded-md transition-all duration-300 hover:bg-[#154f4e]"
//             onClick={() => {
//               handleLogout();
//               setIsOpen(false);
//             }}
//           >
//             <IoLogOutOutline className="icon" /> Log Out
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default DoctorSidebar;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import { FaHome, FaUserGraduate } from "react-icons/fa";

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
  // 🔐 clear authentication completely
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  // (optional safety)
  localStorage.removeItem("user");

  // 🚪 go back to login page
  navigate("/", { replace: true });
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
      {/* Burger Icon */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
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

      {/* Sidebar */}
      <div
  className={`w-[250px] h-screen text-white flex flex-col pt-5 fixed top-0 z-40 transition-transform duration-300 shadow-lg
  ${isOpen ? "left-0" : "-left-[250px]"} md:left-0`}
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
  }}
>
        <div className="pl-5 text-[22px] font-bold mb-5 text-gray-100">Doctor Logbook</div>
        <ul>
          <li
            className={getLinkStyle("/doctor-home")}
            onClick={() => {
              navigate("/doctor-home");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M252-212h85v-188q0-26 18.5-44.5T400-463h160q26 0 44.5 18.5T623-400v188h85v-342L480-725 252-554v342Zm-126 0v-342q0-29.75 13-56.38Q152-637 176-655l228-171q34-26 76-26t76 26l228 171q24 18 37 44.62 13 26.63 13 56.38v342q0 53-36.5 89.5T708-86H575q-26 0-44.5-18.5T512-149v-203h-64v203q0 26-18.5 44.5T385-86H252q-53 0-89.5-36.5T126-212Zm354-257Z"/></svg> Home
          </li>
          <li
            className={getLinkStyle("/doctor-logbook")}
            onClick={() => {
              navigate("/doctor-logbook");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M47-224q-26 0-44.5-18.5T-16-287v-16q0-51 49-82t127-31h17q-17 25-25 52.86T144-305v81H47Zm240 0q-26 0-44.5-18.5T224-287v-18q0-35 18-65t53-52q35-22 82-33t102.96-11q57.04 0 103.54 11 46.5 11 81.5 33t53 52q18 30 18 65v18q0 26-18.5 44.5T673-224H287Zm529 0v-81q0-31.37-8-59.12-8-27.75-24-51.88h16q79.2 0 127.6 30.87Q976-354.26 976-303v16q0 26-18.5 44.5T913-224h-97ZM354-331h253q-21-13-56-21t-70.5-8q-35.5 0-71 8T354-331ZM160.09-452Q123-452 96.5-478.39 70-504.77 70-541.82 70-580 96.39-606q26.38-26 63.43-26Q198-632 224-606.15q26 25.85 26 64.06 0 37.09-25.85 63.59T160.09-452Zm640 0q-37.09 0-63.59-26.39-26.5-26.38-26.5-63.43Q710-580 736.39-606q26.38-26 63.43-26Q838-632 864-606.15q26 25.85 26 64.06 0 37.09-25.85 63.59T800.09-452ZM480-495q-56.67 0-96.33-39.67Q344-574.33 344-631q0-57 39.67-96.5Q423.33-767 480-767q57 0 96.5 39.5T616-631q0 56.67-39.5 96.33Q537-495 480-495Zm.5-106q12.5 0 21-9t8.5-21.5q0-12.5-8.62-21-8.63-8.5-21.38-8.5-12 0-21 8.62-9 8.63-9 21.38 0 12 9 21t21.5 9Zm.5 270Zm-1-300Z"/></svg> View Students
          </li>

          {/* ✅ Your Added Routes */}
          <li
            className={getLinkStyle("/doctor-student-analysis")}
            onClick={() => {
              navigate("/doctor-student-analysis");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M320-414v-306h120v306l-60-56-60 56Zm200 60v-526h120v406L520-354ZM120-216v-344h120v224L120-216Zm0 98 258-258 142 122 224-224h-64v-80h200v200h-80v-64L524-146 382-268 232-118H120Z"/></svg> Analysis
          </li>
          <li
            className={getLinkStyle("/assign-task")}
            onClick={() => {
              navigate("/assign-task");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg> Assign Task
          </li>

          {/* ✅ Partner's improved Account style */}
          <li
            className={getLinkStyle("/account")}
            onClick={() => {
              navigate("/account");
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg> Account
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

export default DoctorSidebar;
