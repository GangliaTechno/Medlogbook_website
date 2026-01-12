import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LogbookCategory from "../Components/logbookCategory";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";

const LogbookPage = () => {
  const userEmail = useSelector((state) => state.auth?.user?.email);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://medlogbook-website.onrender.com/api/category/all?email=${encodeURIComponent(
            userEmail
          )}`
        );

        const categories = response.data.map((category) => ({
          name: category.name,
          description: `Manage ${category.name} log entries`,
          icon: <FaClipboardList />,
          route: `/logbook/${category.name}`,
        }));

        setCategoryList(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [userEmail]);

  return (
    <div
      className="
        min-h-[100dvh]
        px-4
        py-5
        sm:px-6
        lg:px-10
        font-['Inter']
        bg-gray-100
        overflow-x-hidden
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2
          className="
            text-xl
            sm:text-2xl
            lg:text-3xl
            font-bold
            text-gray-900
            mb-3
          "
        >
          Logbook
        </h2>

        {/* Description */}
        <p
          className="
            text-sm
            sm:text-base
            text-gray-700
            max-w-4xl
            mb-8
            leading-relaxed
          "
        >
          Access and manage your clinical logbook categories. Entries from
          previous jobs are stored separately but can be combined for reporting.
        </p>

        {/* Cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
            lg:gap-6
          "
        >
          {categoryList.map((category, index) => (
            <LogbookCategory
              key={index}
              icon={category.icon}
              title={category.name}
              description={category.description}
              route={category.route}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogbookPage;
