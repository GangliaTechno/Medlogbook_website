import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogbookCategory from "../Components/logbookCategory";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";

const LogbookPage = () => {
  const navigate = useNavigate();
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
          name: category.name, // Admissions, POCUS, CPD, Procedures
          description: `Manage ${category.name}`,
          icon: <FaClipboardList />,
          // ✅ FIXED ROUTE
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
    <div className="h-screen flex flex-col text-black p-8">
      <div className="flex-grow overflow-y-auto max-w-7xl w-full mx-auto">
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{
            fontWeight: 900,
            fontSize: "30px",
            color: "rgb(16, 137, 211)",
          }}
        >
          Welcome to your new logbook!
        </h2>

        <p className="text-gray-900 text-center mb-8 max-w-4xl mx-auto">
          Log entries you've made in previous jobs are filed separately and can be
          accessed via the jobs page. Logbooks from multiple jobs can still be
          combined to produce reports.
        </p>

        {/* ✅ Dynamic cards: Admission, POCUS, CPD, Procedures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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
