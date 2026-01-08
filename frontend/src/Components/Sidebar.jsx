import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoClose, IoLogOutOutline, IoMenu } from "react-icons/io5";
import { FaBook, FaBriefcase, FaChartBar, FaBullseye, FaFileAlt, FaCog, FaQuestionCircle } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { FaTasks } from "react-icons/fa";


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Logout function
  const handleLogout = () => {
  // 🔐 clear authentication completely
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  // (optional safety)
  localStorage.removeItem("user");

  // 🚪 go back to login page
  navigate("/", { replace: true });
};


  // Function to get active style
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

     <div
  className={`w-[250px] h-screen text-white flex flex-col pt-5 fixed top-0 z-40 transition-transform duration-300 shadow-lg
  ${isOpen ? "left-0" : "-left-[250px]"} md:left-0`}
  style={{
    background: "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
  }}
>

        <div className="pl-5 text-[22px] font-bold mb-5 text-gray-100">Student Logbook</div>
        <ul>
          <li
            className={getLinkStyle("/logbookpage")}
            onClick={() => navigate("/logbookpage")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M260-283q47 0 91.5 10.5T440-241v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-655v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-283q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-37 131q-15 0-30.5-3.5T425-125q-38-22-79.69-35-41.68-13-85.31-13-38.59 0-75.79 11.5Q147-150 112-132q-35 18-69-1.66T9-191v-481q0-25 11-46.2 11-21.2 33-31.8 48-23 99-33.5T256.89-794q60.11 0 116.61 15T480-731q51-32 107-47.5T703.11-794Q757-794 808-783.5t99 33.5q22 10.6 33 31.8 11 21.2 11 46.2v496q0 34-33.5 48.5T848-132q-35-18-72.21-29.5Q738.59-173 700-173q-43 0-82.5 13.5T541-125q-12 8-27.5 11.5T483-110ZM280-457Zm280-117q0-8.04 5.5-16.52T579-602q29-10 59-15.5t62-5.5q20 0 39.5 2.57t38.5 6.67q9 2.06 15.5 10.27 6.5 8.22 6.5 18.49 0 17-11 24.5t-28 3.5q-15-3-29.5-4.5T700-563q-26 0-50 4.5T603-546q-18.88 7-30.94-1.17Q560-555.33 560-574Zm0 220q0-8.04 5.5-16.52T579-382q29-10 59-15.5t62-5.5q20 0 39.5 2.57t38.5 6.67q9 2.06 15.5 10.27 6.5 8.22 6.5 18.49 0 17-11 24.5t-28 3.5q-15-3-29.5-4.5T700-343q-26 0-50 4t-47 12q-18.88 7-30.94-.65Q560-335.31 560-354Zm0-110q0-8.04 5.5-16.52T579-492q29-10 59-15.5t62-5.5q20 0 39.5 2.57t38.5 6.67q9 2.06 15.5 10.27 6.5 8.22 6.5 18.49 0 17-11 24.5t-28 3.5q-15-3-29.5-4.5T700-453q-26 0-50 4.5T603-436q-18.88 7-30.94-1.17Q560-445.33 560-464Z"/></svg> Primary Logbook
          </li>
          <li
            className={getLinkStyle("/jobs")}
            onClick={() => navigate("/jobs")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M478-86q-133 0-237-78.5T101-366q-7-23 9-42t42-23q25-4 46.5 8.5T228-387q29 78 96.5 126.5T478-212q112 0 190-78t78-190q0-112-78-190t-190-78q-57 0-109 23.5T279-657h34q20 0 34 14t14 34q0 20-14 34.5T313-560H157q-26 0-44.5-18.5T94-623v-155q0-20 14-33.5t34-13.5q20 0 33.5 13.5T189-778v32q56-62 130.5-95T478-874q81 0 153 31t125.5 84.5Q810-705 841-633t31 153q0 81-31 153t-84.5 125.5Q703-148 631-117T478-86Zm50-410 91 90q14 14 14 34t-14 34q-14 14-34 14t-34-14L451-438q-9-9-13.5-20t-4.5-24v-151q0-20 14-33.5t34-13.5q20 0 33.5 13.5T528-633v137Z"/></svg> Assignment history
          </li>
          <li
            className={getLinkStyle("/analysis")}
            onClick={() => navigate("/analysis")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M312-494v-173q0-29 19.5-48.5T380-735q29 0 48.5 19.5T448-667v173q0 29-19.5 48.5T380-426q-29 0-48.5-19.5T312-494Zm208-13v-321q0-27.92 19.76-47.46 19.77-19.54 48-19.54 28.24 0 47.74 19.54Q655-855.92 655-828v321q0 34-20.73 51t-46.5 17Q562-439 541-456q-21-17-21-51ZM105-353v-155.07q0-27.88 19.76-47.41 19.77-19.52 48-19.52 28.24 0 47.74 19.56 19.5 19.57 19.5 47.51v155.39Q240-319 219.27-302t-46.5 17Q147-285 126-302q-21-17-21-51Zm109.94 249Q179-104 165-137t12-59l158-159q17-17 41.51-18 24.51-1 43.49 15l98 83 235-235h-3q-23.37 0-39.19-16.5Q695-543 695-566t16.5-39q16.5-16 39.5-16h127q26 0 44.5 18.5T941-558v128q0 23.37-15.81 39.19Q909.38-375 886-375q-23.37 0-39.19-15.81Q831-406.63 831-430v-3L564-166q-18 18-43 18.5T477-164l-95-86-129 130q-8 8-17.5 12t-20.56 4Z"/></svg> Analysis
          </li>
          <li
  className={getLinkStyle("/assigned-tasks")}
  onClick={() => navigate("/assigned-tasks")}
>
  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M430-177q-26 0-44.5-18.5T367-240q0-26 18.5-44.5T430-303h381q26 0 44.5 18.5T874-240q0 26-18.5 44.5T811-177H430Zm0-240q-26 0-44.5-18.5T367-480q0-26 18.5-44.5T430-543h381q26 0 44.5 18.5T874-480q0 26-18.5 44.5T811-417H430Zm0-240q-26 0-44.5-18.5T367-720q0-26 18.5-44.5T430-783h381q26 0 44.5 18.5T874-720q0 26-18.5 44.5T811-657H430ZM185.76-139q-41.76 0-71.26-29.74Q85-198.48 85-240.24q0-41.76 29.74-71.26 29.74-29.5 71.5-29.5 41.76 0 71.26 29.74 29.5 29.74 29.5 71.5 0 41.76-29.74 71.26-29.74 29.5-71.5 29.5Zm0-240q-41.76 0-71.26-29.74Q85-438.48 85-480.24q0-41.76 29.74-71.26 29.74-29.5 71.5-29.5 41.76 0 71.26 29.74 29.5 29.74 29.5 71.5 0 41.76-29.74 71.26-29.74 29.5-71.5 29.5Zm0-240q-41.76 0-71.26-29.74Q85-678.48 85-720.24q0-41.76 29.74-71.26 29.74-29.5 71.5-29.5 41.76 0 71.26 29.74 29.5 29.74 29.5 71.5 0 41.76-29.74 71.26-29.74 29.5-71.5 29.5Z"/></svg> Assigned Tasks
</li>
          {/*<li
            className={getLinkStyle("/goal-progression")}
            onClick={() => navigate("/goal-progression")}
          >
            <FaBullseye className="icon" /> Goal Progression
          </li>*/}
          <li
            className={getLinkStyle("/reports")}
            onClick={() => navigate("/reports")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M368-237h225q19.97 0 33.49-13.8Q640-264.6 640-285q0-19.98-13.51-33.49Q612.97-332 593-332H367q-19.98 0-33.49 13.52Q320-304.96 320-284.98T333.8-251q13.8 14 34.2 14Zm0-160h225q19.97 0 33.49-13.8Q640-424.6 640-445q0-19.98-13.51-33.49Q612.97-492 593-492H367q-19.98 0-33.49 13.52Q320-464.96 320-444.98T333.8-411q13.8 14 34.2 14ZM252-46q-53 0-89.5-36.5T126-172v-616q0-53 36.5-89.5T252-914h270q25.24 0 48.12 9.5T611-877l186 186q18 18 27.5 40.88Q834-627.24 834-602v430q0 53-36.5 89.5T708-46H252Zm256-605v-137H252v616h456v-416H571q-26 0-44.5-18.5T508-651ZM252-788v200-200 616-616Z"/></svg> Reports
          </li>
          <li
            className={getLinkStyle("/account")}
            onClick={() => navigate("/account")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M239-291q51-37 112-57.5T480.22-369q68.21 0 130.5 22Q673-325 721-290q32-42 49.5-88.5T788-480q0-127-90.5-217.5T480-788q-127 0-217.5 90.5T172-480q0 54 17 100.5t50 88.5Zm241-140q-63 0-105.5-42T332-578q0-63 42.5-105.5T480-726q63 0 105.5 42.5T628-578q0 63-42.5 105T480-431Zm-.08 385Q390-46 311-80q-79-34-138-93T80-311.08q-34-79.09-34-169Q46-570 80-649q34-79 93-138t138.08-93q79.09-34 169-34Q570-914 649-880q79 34 138 93t93 138.08q34 79.09 34 169Q914-390 880-311q-34 79-93 138T648.92-80q-79.09 34-169 34Zm.08-126q48 0 89-13t80-38q-41-26-79.5-38.5T480-274q-51 0-89 12.5T312-223q39 25 79.5 38t88.5 13Zm0-354q22 0 37-15t15-37q0-22-15-37.5T480-631q-22 0-37 15.5T428-578q0 22 15 37t37 15Zm0-52Zm1 355Z"/></svg> Account
          </li>
          <li
            className={getLinkStyle("/support")}
            onClick={() => navigate("/support")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="m432-171-13-1q-148-17-246.5-126.5T74-557q0-161 112.5-272.5T460-941q80 0 150 30.5t122.5 83Q785-775 815.5-705T846-555q0 157-93 278.5T523-71q-15 8-30.5 7.5T463-72q-14-8-22-21.5t-8-30.5l-1-47Zm128-70q71-60 115.5-140.5T720-555q0-109-75.5-184.5T460-815q-109 0-184.5 75.5T200-555q0 109 75.5 184.5T460-295h100v54Zm-100-85q23 0 38.5-15.5T514-380q0-23-15.5-38.5T460-434q-23 0-38.5 15.5T406-380q0 23 15.5 38.5T460-326Zm-92-309q16 6 31.5 0t26.5-20q8-9 16.5-13.5T462-673q17 0 28.5 10t11.5 24q0 12-8 26t-22 27q-23 21-38 44t-15 40q0 17 11.5 28.5T459-462q14 0 25-9.5t19-22.5q8-15 17-28t17-21q29-32 40-53t11-47q0-51-32.5-81T469-754q-37 0-68 15t-47 40q-11 18-7.5 37.5T368-635Zm92 107Z"/></svg> Support
          </li>
          <li
  className="px-6 py-5 flex gap-3 items-center cursor-pointer rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-l-[4px] hover:border-white hover:pl-[16px] text-white"
  onClick={() => {
    handleLogout();
    setIsOpen(false);
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e3e3e3"><path d="M212-86q-53 0-89.5-36.5T86-212v-536q0-53 36.5-89.5T212-874h213q26 0 44.5 18.5T488-811q0 26-18.5 44.5T425-748H212v536h213q26 0 44.5 18.5T488-149q0 26-18.5 44.5T425-86H212Zm423-331H415q-26 0-44.5-18.5T352-480q0-26 18.5-44.5T415-543h220l-52-52q-18-18-18-44t18-44q18-19 43.5-19t44.5 19l159 159q18 19 18 44t-18 44L671-277q-18 19-44 19t-44-19q-18-18-18-44t18-44l52-52Z"/></svg>Log Out
</li>

        </ul>
      </div>
    </>
  );
};

export default Sidebar;

