
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import "../styles/LogbookPage.css";

const LogbookCategory = ({ icon, title, description, route }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg shadow-md cursor-pointer transition duration-300 hover:bg-white
    " onClick={() => navigate(route)}>
      <div className="flex items-center gap-[10px] flex-grow justify-start">
        <span className="text-2xl text-black">{icon}</span>
        <div>
          <h3 className="text-base text-black m-0">{title}</h3>
          <p className="text-xs text-black m-0">{description}</p>
        </div>
      </div>
      <FaArrowRight className="text-lg text-black ml-auto" />
    </div>
  );
};

export default LogbookCategory;