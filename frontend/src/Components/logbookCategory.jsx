import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const LogbookCategory = ({ icon, title, description, route }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="
        relative
        cursor-pointer
        bg-white
        rounded-lg
        border
        border-gray-300

        p-6
        flex
        gap-5
        items-start

        shadow-[0_4px_14px_rgba(0,0,0,0.08)]
        transition-all
        duration-200

        sm:hover:shadow-[0_10px_26px_rgba(0,0,0,0.12)]
        sm:hover:-translate-y-[2px]
      "
    >
      {/* LEFT BLUE ACCENT BAR */}
      <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-600 rounded-l-lg" />

      {/* Icon */}
      <div
        className="
          ml-3
          flex
          items-center
          justify-center
          w-12
          h-12
          rounded-md
          bg-blue-50
          text-blue-700
          text-lg
          shrink-0
        "
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className="
            text-base
            sm:text-lg
            font-semibold
            text-gray-900
            mb-1.5
            leading-snug
          "
        >
          {title}
        </h3>

        <p
          className="
            text-sm
            font-normal
            text-gray-600
            leading-relaxed
          "
        >
          {description}
        </p>
      </div>

      {/* Arrow */}
      <FiChevronRight
        size={20}
        className="text-gray-400 mt-1"
      />
    </div>
  );
};

export default LogbookCategory;
