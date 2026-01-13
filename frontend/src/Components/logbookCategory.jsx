import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FaFileMedical, FaChevronRight } from "react-icons/fa";

const LogbookCategory = ({ title, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/logbook/${title}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        group
        relative
        bg-white
        rounded-2xl
        p-6
        cursor-pointer
        border
        border-slate-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]
        hover:border-blue-200
        hover:-translate-y-1
        flex
        flex-col
        h-full
        justify-between
        overflow-hidden
      "
    >
      {/* Top decorative line/gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Icon / Avatar Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="
                w-12 h-12 
                rounded-xl 
                bg-blue-50 
                text-blue-600 
                flex items-center justify-center 
                text-xl
                group-hover:bg-blue-600 
                group-hover:text-white 
                transition-colors 
                duration-300
            ">
            <FaFileMedical />
          </div>

          <div className="
                w-8 h-8 
                rounded-full 
                bg-slate-50 
                flex items-center justify-center 
                text-slate-400
                group-hover:text-blue-600
                group-hover:bg-blue-50
                transition-all
                duration-300
                group-hover:translate-x-1
            ">
            <FaChevronRight size={14} />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          {description || "View and manage entries for this category."}
        </p>
      </div>
    </div>
  );
};

export default LogbookCategory;
